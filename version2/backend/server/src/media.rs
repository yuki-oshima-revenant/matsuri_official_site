use axum::{
    response::{IntoResponse, Response},
    routing::post,
    Json, Router,
};
use matsuri_official_site_common::{
    media::{create_media_signed_url, MediaFormat, S3Processer},
    EnvironmentVariables,
};
use reqwest::{header, StatusCode};
use serde::{Deserialize, Serialize};
use tower_sessions::Session;
use tracing::error;

use crate::session::get_user_info_from_session;

pub fn api_media_router() -> Router {
    let router = Router::new().route("/get_url", post(get_url_handler));
    router
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
    let s3_processer = S3Processer::new(environment_variables.clone()).await;
    match s3_processer
        .check_media_object_exists(&media_format, &event_id, performance_order)
        .await
    {
        Ok(true) => (),
        Ok(false) => {
            return StatusCode::NOT_FOUND.into_response();
        }
        Err(error) => {
            error!("failed to check media object exists {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    }
    let url = match create_media_signed_url(
        &environment_variables,
        &media_format,
        &event_id,
        performance_order,
    ) {
        Ok(url) => url,
        Err(error) => {
            error!("failed to create media signed url {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
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
