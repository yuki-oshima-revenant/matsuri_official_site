use axum::Router;
use lambda_http::tower::ServiceBuilder;
use matsuri_official_site_common::load_env_file;
use matsuri_official_site_server::{auth, event, media, performance};
use std::env::set_var;
use time::Duration;
use tower_sessions::{Expiry, MemoryStore, SessionManagerLayer};

#[tokio::main]
async fn main() -> Result<(), lambda_http::Error> {
    // https://github.com/awslabs/aws-lambda-rust-runtime/blob/main/examples/http-axum/src/main.rs
    set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");
    lambda_http::tracing::init_default_subscriber();

    // todo: dynamodb store
    let session_store = MemoryStore::default();
    let session_service = ServiceBuilder::new().layer(
        SessionManagerLayer::new(session_store)
            .with_secure(!cfg!(debug_assertions))
            .with_expiry(Expiry::OnInactivity(Duration::days(1))),
    );

    let app = Router::new()
        .nest("/auth", auth::api_auth_router())
        .nest("/event", event::api_event_router())
        .nest("/performance", performance::api_performance_router())
        .nest("/media", media::api_media_router())
        .layer(session_service);

    if cfg!(debug_assertions) {
        load_env_file()?;
        let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
        axum::serve(listener, app).await?;
        Ok(())
    } else {
        lambda_http::run(app).await
    }
}
