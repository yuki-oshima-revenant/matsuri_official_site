pub mod dynamodb;
pub mod google;
pub mod media;

use std::{
    env::{self, VarError},
    error::Error,
};

pub type OpaqueError = Box<dyn Error + Send + Sync + 'static>;

pub fn load_env_file() -> Result<(), OpaqueError> {
    let mut env_file_path = env::current_dir()?.join(".env");
    for ancestor in env::current_exe()?.ancestors() {
        if ancestor.ends_with("backend") {
            env_file_path = ancestor.join(".env");
            break;
        }
    }
    dotenvy::from_path_override(env_file_path)?;
    Ok(())
}

#[derive(Clone)]
pub struct EnvironmentVariables {
    pub auth_default_return_to: String,
    pub google_oauth_client_id: String,
    pub google_oauth_client_secret: String,
    pub google_oauth_redirect_uri: String,
    pub cloudfront_distribution_domain_name: String,
    pub cloudfront_key_pair_id: String,
    pub cloudfront_key_pair_private_key: String,
}

impl EnvironmentVariables {
    pub fn new() -> Result<Self, VarError> {
        Ok(Self {
            auth_default_return_to: env::var("AUTH_DEFAULT_RETURN_TO")?,
            google_oauth_client_id: env::var("GOOGLE_OAUTH_CLIENT_ID")?,
            google_oauth_client_secret: env::var("GOOGLE_OAUTH_CLIENT_SECRET")?,
            google_oauth_redirect_uri: env::var("GOOGLE_OAUTH_REDIRECT_URI")?,
            cloudfront_distribution_domain_name: env::var("CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME")?,
            cloudfront_key_pair_id: env::var("CLOUDFRONT_KEY_PAIR_ID")?,
            cloudfront_key_pair_private_key: env::var("CLOUDFRONT_KEY_PAIR_PRIVATE_KEY")?,
        })
    }
}
