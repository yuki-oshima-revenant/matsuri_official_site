use crate::{EnvironmentVariables, OpaqueError};
use aws_sdk_s3::operation::head_object::HeadObjectError;
use base64::Engine;
use rsa::pkcs8::DecodePrivateKey;
use serde::{Deserialize, Serialize};
use sha1::{Digest, Sha1};
use url::Url;

const S3_MEDIA_OBJECT_KEY_PREFIX: &str = "matsuri";

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum MediaFormat {
    Audio,
    Video,
}

impl MediaFormat {
    fn get_path(&self) -> String {
        match self {
            MediaFormat::Audio => "audio".to_string(),
            MediaFormat::Video => "video".to_string(),
        }
    }
}

pub struct S3Processer {
    environment_variables: EnvironmentVariables,
    s3_client: aws_sdk_s3::Client,
}

impl S3Processer {
    pub async fn new(environment_variables: EnvironmentVariables) -> Self {
        let config = aws_config::load_from_env().await;
        let s3_client = aws_sdk_s3::Client::new(&config);
        Self {
            environment_variables,
            s3_client,
        }
    }

    pub async fn check_media_object_exists(
        &self,
        media_format: &MediaFormat,
        event_id: &str,
        performance_order: u32,
    ) -> Result<bool, OpaqueError> {
        let object_key = format!(
            "{}/{}/{}/{}",
            S3_MEDIA_OBJECT_KEY_PREFIX,
            media_format.get_path(),
            event_id,
            performance_order
        );
        match self
            .s3_client
            .head_object()
            .bucket(
                &self
                    .environment_variables
                    .cloudfront_distribution_domain_name,
            )
            .key(object_key)
            .send()
            .await
        {
            Ok(_) => Ok(true),
            Err(error) => {
                let head_object_error = error.into_service_error();
                match head_object_error {
                    HeadObjectError::NotFound(_) => Ok(false),
                    _ => Err(head_object_error.into()),
                }
            }
        }
    }
}

#[derive(Debug, Serialize)]
struct PolicyStatementConditionDateLessThan {
    #[serde(rename = "AWS:EpochTime")]
    aws_epoch_time: i64,
}

#[derive(Debug, Serialize)]
struct PolicyStatementCondition {
    #[serde(rename = "DateLessThan")]
    date_less_than: PolicyStatementConditionDateLessThan,
}

#[derive(Debug, Serialize)]
struct PolicyStatement {
    #[serde(rename = "Resource")]
    resource: String,
    #[serde(rename = "Condition")]
    condition: PolicyStatementCondition,
}

#[derive(Debug, Serialize)]
struct PolicyStatements {
    #[serde(rename = "Statement")]
    statement: Vec<PolicyStatement>,
}

pub fn create_media_signed_url(
    environment_variables: &EnvironmentVariables,
    media_format: &MediaFormat,
    event_id: &str,
    performance_order: u32,
) -> Result<Url, OpaqueError> {
    let mut url = Url::parse(&format!(
        "https://{}/{}/{}/{}/{}",
        &environment_variables.cloudfront_distribution_domain_name,
        S3_MEDIA_OBJECT_KEY_PREFIX,
        media_format.get_path(),
        event_id,
        performance_order
    ))?;
    let expire_time = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .ok_or("failed to calculate expire time")?;
    let policy_statements = PolicyStatements {
        statement: vec![PolicyStatement {
            resource: url.to_string(),
            condition: PolicyStatementCondition {
                date_less_than: PolicyStatementConditionDateLessThan {
                    aws_epoch_time: expire_time.timestamp(),
                },
            },
        }],
    };
    let signature = create_cloudfront_signature(policy_statements, &environment_variables)?;
    url.set_query(Some(&format!(
        "Expires={}&Signature={}&Key-Pair-Id={}",
        expire_time.timestamp(),
        signature,
        environment_variables.cloudfront_key_pair_id
    )));
    Ok(url)
}

fn create_cloudfront_signature(
    policy: PolicyStatements,
    environment_variables: &EnvironmentVariables,
) -> Result<String, OpaqueError> {
    let private_key = rsa::RsaPrivateKey::from_pkcs8_pem(
        &environment_variables
            .cloudfront_key_pair_private_key
            .replace("\\n", "\n"),
    )?;
    let mut hasher = Sha1::new();
    hasher.update(serde_json::to_vec(&policy)?.as_slice());
    let sha1_digest = hasher.finalize();
    let signed = private_key.sign(rsa::Pkcs1v15Sign::new::<Sha1>(), &sha1_digest)?;
    let base64_encoded = base64::engine::general_purpose::STANDARD.encode(&signed);
    let normalized = base64_encoded
        .replace('+', "-")
        .replace('=', "_")
        .replace('/', "~");
    Ok(normalized)
}
