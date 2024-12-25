use axum::{
    http::{HeaderName, HeaderValue},
    Router,
};
use matsuri_official_site_common::load_env_file;
use matsuri_official_site_server::{auth, event, media, performance};
use reqwest::Method;
use std::env::set_var;
use time::Duration;
use tower_http::cors::CorsLayer;
use tower_sessions::{Expiry, SessionManagerLayer};
use tower_sessions_dynamodb_store::{DynamoDBStore, DynamoDBStoreProps};

#[tokio::main]
async fn main() -> Result<(), lambda_http::Error> {
    // https://github.com/awslabs/aws-lambda-rust-runtime/blob/main/examples/http-axum/src/main.rs
    set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");
    lambda_http::tracing::init_default_subscriber();

    let config = aws_config::load_from_env().await;
    let dynamodb_client = aws_sdk_dynamodb::Client::new(&config);
    let store_props = DynamoDBStoreProps {
        table_name: "matsuri-official-site_session".to_string(),
        ..Default::default()
    };
    let session_store = DynamoDBStore::new(dynamodb_client, store_props);
    let session_layer = SessionManagerLayer::new(session_store)
        .with_secure(!cfg!(debug_assertions))
        .with_domain(if cfg!(debug_assertions) {
            "localhost".to_string()
        } else {
            "unronritaro.net".to_string()
        })
        .with_expiry(Expiry::OnInactivity(Duration::days(30)));

    let app = Router::new()
        .nest("/auth", auth::api_auth_router())
        .nest("/event", event::api_event_router())
        .nest("/performance", performance::api_performance_router())
        .nest("/media", media::api_media_router())
        .layer(session_layer)
        .layer(
            CorsLayer::new()
                .allow_methods([Method::GET, Method::POST, Method::OPTIONS, Method::HEAD])
                .allow_origin(vec![HeaderValue::from_static(
                    "https://matsuri.unronritaro.net",
                )])
                .allow_credentials(true)
                .allow_headers([HeaderName::from_static("content-type")]),
        );

    if cfg!(debug_assertions) {
        load_env_file()?;
        let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
        axum::serve(listener, app).await?;
        Ok(())
    } else {
        lambda_http::run(app).await
    }
}
