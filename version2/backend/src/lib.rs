pub mod auth;
mod google;
mod session;

use std::{
    env::{self, VarError},
    error::Error,
};

pub type OpaqueError = Box<dyn Error + Send + Sync + 'static>;

pub struct EnvironmentVariables {
    pub auth_default_return_to: String,
    pub google_oauth_client_id: String,
    pub google_oauth_client_secret: String,
    pub google_oauth_redirect_uri: String,
}

impl EnvironmentVariables {
    pub fn new() -> Result<Self, VarError> {
        Ok(Self {
            auth_default_return_to: env::var("AUTH_DEFAULT_RETURN_TO")?,
            google_oauth_client_id: env::var("GOOGLE_OAUTH_CLIENT_ID")?,
            google_oauth_client_secret: env::var("GOOGLE_OAUTH_CLIENT_SECRET")?,
            google_oauth_redirect_uri: env::var("GOOGLE_OAUTH_REDIRECT_URI")?,
        })
    }
}
