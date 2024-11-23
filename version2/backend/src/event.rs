use axum::{
    response::{IntoResponse, Response},
    routing::post,
    Json, Router,
};
use reqwest::{header, StatusCode};
use serde::Deserialize;
use tower_sessions::Session;
use tracing::error;

use crate::{dynamodb::DynamodbProcesser, session::get_user_info_from_session};

pub fn api_event_router() -> Router {
    let router = Router::new()
        .route("/get", post(get_handler))
        .route("/list", post(list_handler));
    router
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GetEventRequest {
    event_id: String,
}

async fn get_handler(
    session: Session,
    Json(GetEventRequest { event_id }): Json<GetEventRequest>,
) -> Response {
    match get_user_info_from_session(session).await {
        Ok(user) => user,
        Err(_) => {
            return StatusCode::UNAUTHORIZED.into_response();
        }
    };
    let dynamodb_processer = DynamodbProcesser::new().await;
    let event = match dynamodb_processer.get_event(&event_id).await {
        Ok(event) => event,
        Err(error) => {
            error!("failed to get event {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let response_body = match serde_json::to_string(&event) {
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

async fn list_handler(session: Session) -> Response {
    match get_user_info_from_session(session).await {
        Ok(user) => user,
        Err(_) => {
            return StatusCode::UNAUTHORIZED.into_response();
        }
    };
    let dynamodb_processer = DynamodbProcesser::new().await;
    let mut events = match dynamodb_processer.list_events().await {
        Ok(events) => events,
        Err(error) => {
            error!("failed to get event {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    events.sort_by(|a, b| b.get_date().cmp(&a.get_date()));
    let response_body = match serde_json::to_string(&events) {
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
