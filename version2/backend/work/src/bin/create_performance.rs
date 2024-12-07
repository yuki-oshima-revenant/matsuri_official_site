use matsuri_official_site_common::dynamodb::DynamodbProcesser;

#[tokio::main]
async fn main() {
    let dynamodb_client = DynamodbProcesser::new().await;
}
