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

pub fn api_performance_router() -> Router {
    let router = Router::new()
        .route("/get", post(get_handler))
        .route("/list_in_event", post(list_in_event_handler))
        .route("/list", post(list_handler));
    router
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct GetPerformanceRequest {
    event_id: String,
    performance_order: u32,
}

async fn get_handler(
    session: Session,
    Json(GetPerformanceRequest {
        event_id,
        performance_order,
    }): Json<GetPerformanceRequest>,
) -> Response {
    match get_user_info_from_session(session).await {
        Ok(user) => user,
        Err(_) => {
            return StatusCode::UNAUTHORIZED.into_response();
        }
    };
    let dynamodb_processer = DynamodbProcesser::new().await;
    let performance = match dynamodb_processer
        .get_performance(&event_id, performance_order)
        .await
    {
        Ok(performance) => performance,
        Err(error) => {
            error!("failed to get performance {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    let response_body = match serde_json::to_string(&performance) {
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

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ListInEventPerformanceRequest {
    event_id: String,
}

async fn list_in_event_handler(
    session: Session,
    Json(ListInEventPerformanceRequest { event_id }): Json<ListInEventPerformanceRequest>,
) -> Response {
    match get_user_info_from_session(session).await {
        Ok(user) => user,
        Err(_) => {
            return StatusCode::UNAUTHORIZED.into_response();
        }
    };
    let dynamodb_processer = DynamodbProcesser::new().await;
    let mut performances = match dynamodb_processer.list_event_performances(&event_id).await {
        Ok(performances) => performances,
        Err(error) => {
            error!("failed to get performances {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    performances.sort_by(|a, b| a.get_performance_order().cmp(&b.get_performance_order()));
    let response_body = match serde_json::to_string(&performances) {
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
    let mut performances = match dynamodb_processer.list_performances().await {
        Ok(performances) => performances,
        Err(error) => {
            error!("failed to get performances {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    performances.sort_by(|a, b| a.get_performance_order().cmp(&b.get_performance_order()));
    let response_body = match serde_json::to_string(&performances) {
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
