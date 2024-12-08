use aws_sdk_s3::{primitives::ByteStream, types::StorageClass};
use matsuri_official_site_common::{load_env_file, OpaqueError};
use std::env;

const AWS_BUCKET_NAME: &str = "delivery.unronritaro.net";

#[tokio::main]
async fn main() -> Result<(), OpaqueError> {
    load_env_file()?;
    let config = aws_config::load_from_env().await;
    let s3_client = aws_sdk_s3::Client::new(&config);
    let data_dir = env::current_dir()?.join("..").join("..").join("data");
    let media_dir = data_dir.join("media");
    let audio_dir = media_dir.join("audio");
    for event_dir in audio_dir.read_dir()? {
        let event_dir = event_dir?;
        let event_dir_path = event_dir.path();
        for audio_entry in event_dir_path.read_dir()? {
            let audio_entry = audio_entry?;
            let audio_path = audio_entry.path();
            if audio_path.is_file() {
                if audio_path.extension() == Some("mp3".as_ref()) {
                    println!("uploading {:?}", audio_path.file_name());
                    s3_client
                        .put_object()
                        .bucket(AWS_BUCKET_NAME)
                        .key(&format!(
                            "matsuri/audio/{}/{}",
                            event_dir_path.file_name().unwrap().to_str().unwrap(),
                            audio_path.file_stem().unwrap().to_str().unwrap()
                        ))
                        .body(ByteStream::from_path(&audio_path).await?)
                        .storage_class(StorageClass::IntelligentTiering)
                        .content_type("audio/mpeg")
                        .send()
                        .await?;
                }
            }
        }
    }
    let video_dir = media_dir.join("video");
    for event_dir in video_dir.read_dir()? {
        let event_dir = event_dir?;
        let event_dir_path = event_dir.path();
        for video_entry in event_dir_path.read_dir()? {
            let video_entry = video_entry?;
            let video_path = video_entry.path();
            if video_path.is_file() {
                if video_path.extension() == Some("mp4".as_ref()) {
                    println!("uploading {:?}", video_path.file_name());
                    s3_client
                        .put_object()
                        .bucket(AWS_BUCKET_NAME)
                        .key(&format!(
                            "matsuri/video/{}/{}",
                            event_dir_path.file_name().unwrap().to_str().unwrap(),
                            video_path.file_stem().unwrap().to_str().unwrap()
                        ))
                        .body(ByteStream::from_path(&video_path).await?)
                        .storage_class(StorageClass::IntelligentTiering)
                        .content_type("video/mp4")
                        .send()
                        .await?;
                }
            }
        }
    }
    Ok(())
}
