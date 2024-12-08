use axum::{
    response::{IntoResponse, Response},
    routing::post,
    Json, Router,
};
use base64::Engine;
use matsuri_official_site_common::{EnvironmentVariables, OpaqueError};
use reqwest::{header, StatusCode};
use rsa::pkcs8::DecodePrivateKey;
use serde::{Deserialize, Serialize};
use sha1::{Digest, Sha1};
use tower_sessions::Session;
use tracing::error;
use url::Url;

use crate::session::get_user_info_from_session;

pub fn api_media_router() -> Router {
    let router = Router::new().route("/get_url", post(get_url_handler));
    router
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
enum MediaFormat {
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

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GetUrlRequest {
    event_id: String,
    performance_order: u32,
    media_format: MediaFormat,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct GetUrlResponse {
    url: String,
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

async fn get_url_handler(
    session: Session,
    Json(GetUrlRequest {
        event_id,
        performance_order,
        media_format,
    }): Json<GetUrlRequest>,
) -> Response {
    match get_user_info_from_session(session).await {
        Ok(user) => user,
        Err(_) => {
            return StatusCode::UNAUTHORIZED.into_response();
        }
    };
    let environment_variables = match EnvironmentVariables::new() {
        Ok(environment_variables) => environment_variables,
        Err(error) => {
            error!("failed to get environment variables {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let mut url = match Url::parse(&format!(
        "https://{}/matsuri/{}/{}/{}",
        &environment_variables.cloudfront_distribution_domain_name,
        media_format.get_path(),
        event_id,
        performance_order
    )) {
        Ok(url) => url,
        Err(error) => {
            error!("failed parse url {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let expire_time = match chrono::Utc::now().checked_add_signed(chrono::Duration::hours(24)) {
        Some(expire_time) => expire_time,
        None => {
            error!("failed to calculate expire time");
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
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
    let signature = match create_cloudfront_signature(policy_statements, &environment_variables) {
        Ok(signature) => signature,
        Err(error) => {
            error!("failed to create cloudfront signature {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    url.set_query(Some(&format!(
        "Expires={}&Signature={}&Key-Pair-Id={}",
        expire_time.timestamp(),
        signature,
        environment_variables.cloudfront_key_pair_id
    )));
    let response_body = match serde_json::to_string(&GetUrlResponse {
        url: url.to_string(),
    }) {
        Ok(response_body) => response_body,
        Err(error) => {
            error!("failed to serialize response body {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    (
        StatusCode::OK,
        [(header::CONTENT_TYPE, "application/json")],
        response_body,
    )
        .into_response()
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
