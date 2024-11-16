use axum::{
    extract::Query,
    response::{IntoResponse, Redirect, Response},
    routing::get,
    Router,
};
use reqwest::{header, StatusCode};
use serde::{Deserialize, Serialize};
use tower_sessions::Session;
use tracing::error;
use url::Url;

use crate::{
    google::{format_auth_request_url, get_google_oauth_token, get_google_user_info},
    session::{get_user_info_from_session, User, SESSION_USER_KEY},
    EnvironmentVariables,
};

pub fn api_auth_router() -> Router {
    let router = Router::new()
        .route("/checklogin", get(checklogin_handler))
        .route("/login", get(login_handler))
        .route("/redirect", get(redirect_handler));
    router
}

async fn checklogin_handler(session: Session) -> Response {
    let user = match get_user_info_from_session(session).await {
        Ok(user) => user,
        Err(_) => {
            return StatusCode::UNAUTHORIZED.into_response();
        }
    };
    let response_body = match serde_json::to_string(&user) {
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

#[derive(Debug, Deserialize, Serialize)]
pub struct SigninParams {
    pub return_to: Option<String>,
}

async fn login_handler(Query(params): Query<SigninParams>) -> Response {
    let environment_variables = match EnvironmentVariables::new() {
        Ok(environment_variables) => environment_variables,
        Err(error) => {
            error!("failed to get environment variables {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let url = match format_auth_request_url(&environment_variables, &params) {
        Ok(url) => url,
        Err(error) => {
            error!("failed to format auth request url {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    Redirect::to(url.as_str()).into_response()
}

#[derive(Debug, Deserialize)]
struct OauthCallbackParams {
    code: Option<String>,
    state: Option<String>,
}

async fn redirect_handler(session: Session, Query(params): Query<OauthCallbackParams>) -> Response {
    let environment_variables = match EnvironmentVariables::new() {
        Ok(environment_variables) => environment_variables,
        Err(error) => {
            error!("failed to get environment variables {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let (code, state) = match params {
        OauthCallbackParams {
            code: Some(code),
            state: Some(state),
        } => (code, state),
        _ => {
            error!("invalid params");
            return StatusCode::BAD_REQUEST.into_response();
        }
    };
    let return_to = match serde_json::from_str(state.as_str()) {
        Ok(SigninParams { return_to }) => return_to,
        _ => {
            error!("invalid state");
            return StatusCode::BAD_REQUEST.into_response();
        }
    };
    let reqwest_client = reqwest::Client::new();
    let token_response =
        match get_google_oauth_token(&environment_variables, &reqwest_client, &code).await {
            Ok(token_response_body) => token_response_body,
            Err(error) => {
                error!("failed to get token {:?}", error);
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
        };
    let user_info_response = match get_google_user_info(&reqwest_client, &token_response).await {
        Ok(user_info_response_body) => user_info_response_body,
        Err(error) => {
            error!("failed to get user info {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    match session
        .insert(
            SESSION_USER_KEY,
            User {
                id: user_info_response.sub,
                name: user_info_response.name,
                mailaddress: user_info_response.email,
                picture_url: user_info_response.picture,
            },
        )
        .await
    {
        Ok(_) => (),
        Err(error) => {
            error!("failed to insert user info into session {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    }
    let return_to = if let Some(return_to) = return_to {
        return_to
    } else {
        environment_variables.auth_default_return_to
    };
    let url = match Url::parse(return_to.as_str()) {
        Ok(url) => url,
        Err(error) => {
            error!("failed to format redirect url {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    Redirect::to(url.as_str()).into_response()
}
