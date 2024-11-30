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

// allow no login user to view performance with out track list
async fn get_handler(
    session: Session,
    Json(GetPerformanceRequest {
        event_id,
        performance_order,
    }): Json<GetPerformanceRequest>,
) -> Response {
    let dynamodb_processer = DynamodbProcesser::new().await;
    let mut performance = match dynamodb_processer
        .get_performance(&event_id, performance_order)
        .await
    {
        Ok(performance) => performance,
        Err(error) => {
            error!("failed to get performance {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    match get_user_info_from_session(session).await {
        Ok(_) => (),
        Err(_) => {
            performance.filter_out_track_list();
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

// allow no login user to view performance with out track list
async fn list_in_event_handler(
    session: Session,
    Json(ListInEventPerformanceRequest { event_id }): Json<ListInEventPerformanceRequest>,
) -> Response {
    let dynamodb_processer = DynamodbProcesser::new().await;
    let mut performances = match dynamodb_processer.list_event_performances(&event_id).await {
        Ok(performances) => performances,
        Err(error) => {
            error!("failed to get performances {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    performances.sort_by(|a, b| a.get_performance_order().cmp(&b.get_performance_order()));
    match get_user_info_from_session(session).await {
        Ok(_) => (),
        Err(_) => {
            for performance in performances.iter_mut() {
                performance.filter_out_track_list();
            }
        }
    };
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

// allow no login user to view performance with out track list
async fn list_handler(session: Session) -> Response {
    let dynamodb_processer = DynamodbProcesser::new().await;
    let mut performances = match dynamodb_processer.list_performances().await {
        Ok(performances) => performances,
        Err(error) => {
            error!("failed to get performances {:?}", error);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };
    performances.sort_by(|a, b| a.get_performance_order().cmp(&b.get_performance_order()));
    match get_user_info_from_session(session).await {
        Ok(_) => (),
        Err(_) => {
            for performance in performances.iter_mut() {
                performance.filter_out_track_list();
            }
        }
    };
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
