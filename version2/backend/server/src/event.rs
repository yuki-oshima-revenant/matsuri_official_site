use axum::{
    response::{IntoResponse, Response},
    routing::post,
    Json, Router,
};
use matsuri_official_site_common::dynamodb::DynamodbProcesser;
use reqwest::{header, StatusCode};
use serde::Deserialize;
use tracing::error;

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

// allow no login user
async fn get_handler(Json(GetEventRequest { event_id }): Json<GetEventRequest>) -> Response {
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

// allow no login user
async fn list_handler() -> Response {
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
