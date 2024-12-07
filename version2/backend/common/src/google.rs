use crate::{EnvironmentVariables, OpaqueError};
use axum::http::HeaderMap;
use serde::{Deserialize, Serialize};
use url::Url;

const SCOPES: [&'static str; 3] = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];

pub fn format_auth_request_url<T: Serialize>(
    environment_variables: &EnvironmentVariables,
    singin_params: T,
) -> Result<Url, OpaqueError> {
    let url = Url::parse_with_params(
        "https://accounts.google.com/o/oauth2/v2/auth",
        &[
            (
                "client_id",
                environment_variables.google_oauth_client_id.as_str(),
            ),
            (
                "redirect_uri",
                environment_variables.google_oauth_redirect_uri.as_str(),
            ),
            ("response_type", "code"),
            ("scope", SCOPES.join(" ").as_str()),
            ("state", serde_json::to_string(&singin_params)?.as_str()),
            ("access_type", "online"),
            ("prompt", "select_account"),
        ],
    )?;
    Ok(url)
}

#[derive(Debug, Deserialize)]
pub struct TokenResonse {
    pub access_token: String,
    pub scope: String,
    pub id_token: String,
}

pub async fn get_google_oauth_token(
    environment_variables: &EnvironmentVariables,
    reqwest_client: &reqwest::Client,
    code: &String,
) -> Result<TokenResonse, OpaqueError> {
    let token_response = reqwest_client
        .post("https://oauth2.googleapis.com/token")
        .form(&[
            (
                "client_id",
                environment_variables.google_oauth_client_id.as_str(),
            ),
            (
                "client_secret",
                environment_variables.google_oauth_client_secret.as_str(),
            ),
            ("code", code.as_str()),
            ("grant_type", "authorization_code"),
            (
                "redirect_uri",
                environment_variables.google_oauth_redirect_uri.as_str(),
            ),
        ])
        .send()
        .await?
        .error_for_status()?;
    let token_response_body: TokenResonse =
        serde_json::from_slice(token_response.bytes().await?.to_vec().as_slice())?;
    Ok(token_response_body)
}

#[derive(Debug, Deserialize)]
pub struct UserInfoResponse {
    pub sub: String,
    pub name: String,
    pub picture: String,
    pub email: String,
}

pub async fn get_google_user_info(
    reqwest_client: &reqwest::Client,
    token_response: &TokenResonse,
) -> Result<UserInfoResponse, OpaqueError> {
    let mut user_info_headers = HeaderMap::new();
    user_info_headers.append(
        reqwest::header::AUTHORIZATION,
        format!("Bearer {}", token_response.access_token).parse()?,
    );
    user_info_headers.append(reqwest::header::CONTENT_LENGTH, "0".parse()?);
    let user_info_respose = reqwest_client
        .post("https://openidconnect.googleapis.com/v1/userinfo")
        .headers(user_info_headers)
        .send()
        .await?
        .error_for_status()?;
    let user_info_response_body: UserInfoResponse =
        serde_json::from_slice(user_info_respose.bytes().await?.to_vec().as_slice())?;
    Ok(user_info_response_body)
}
