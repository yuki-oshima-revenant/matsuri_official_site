use matsuri_official_site_common::{
    dynamodb::{DynamodbProcesser, Event, GoogleDrive, Performance, Track},
    load_env_file, OpaqueError,
};
use serde::Deserialize;
use std::env;
use std::path::PathBuf;
use tokio::fs;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Archive {
    evnet_id: String,
    parformances: Vec<ArchivePerformance>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ArchivePerformance {
    name: String,
    time: String,
    tracklist_id: Option<String>,
    recording_id: Option<String>,
    video_id: Option<String>,
    stream_rec_id: Option<String>,
}

impl Archive {
    async fn format_into_performances(
        &self,
        event: &Event,
        data_dir: &PathBuf,
    ) -> Result<Vec<Performance>, OpaqueError> {
        let mut performances = Vec::new();
        for (index, archive_performance) in self.parformances.iter().enumerate() {
            let performance_order = index as i64 + 1;
            let mut start_time = 0;
            let mut end_time = 0;
            let times = archive_performance.time.split("~");
            for (index, time) in times.into_iter().enumerate() {
                match index {
                    0 => {
                        start_time = format_performance_time(event.date, &time)?;
                    }
                    1 => {
                        end_time = format_performance_time(event.date, &time)?;
                    }
                    _ => (),
                }
            }
            if end_time == 0 {
                end_time = start_time;
            }
            let video_id = if let Some(stream_rec_id) = &archive_performance.stream_rec_id {
                Some(stream_rec_id.clone())
            } else {
                archive_performance.video_id.clone()
            };
            let mut track_list = Vec::new();
            if let Ok(tracklist_text) = fs::read_to_string(
                data_dir
                    .join("tracklist")
                    .join(&event.event_id)
                    .join(performance_order.to_string())
                    .with_extension("tsv"),
            )
            .await
            {
                for (index, line) in tracklist_text.lines().enumerate() {
                    if index == 0 {
                        continue;
                    }
                    let track = Track::from_tsv_line(line)?;
                    track_list.push(track);
                }
            }
            let performance = Performance {
                event_id: self.evnet_id.clone(),
                performance_order,
                performer_name: archive_performance.name.clone(),
                start_time,
                end_time,
                google_drive: GoogleDrive {
                    tracklist_id: archive_performance.tracklist_id.clone(),
                    audio_id: archive_performance.recording_id.clone(),
                    video_id,
                },
                track_list,
            };
            performances.push(performance);
        }
        Ok(performances)
    }
}

fn format_performance_time(date: i64, time: &str) -> Result<i64, OpaqueError> {
    let time = format!("{:04}", time.trim().replace(":", "").parse::<i64>()?);
    Ok(if time.starts_with("0") {
        date * 10000 + time.parse::<i64>()? + 10000
    } else {
        date * 10000 + time.parse::<i64>()?
    })
}

#[tokio::main]
async fn main() -> Result<(), OpaqueError> {
    load_env_file()?;
    let dynamodb_client = DynamodbProcesser::new().await;
    let events = dynamodb_client.list_events().await?;
    let data_dir = env::current_dir()?.join("..").join("..").join("data");
    let archive_json_path = data_dir.join("archive.json");
    let archive_json = fs::read_to_string(archive_json_path).await?;
    let archives: Vec<Archive> = serde_json::from_str(&archive_json)?;
    println!("{:?}", archives);
    let mut all_performances = Vec::new();
    for archive in archives {
        let event = events
            .iter()
            .find(|event| event.event_id == archive.evnet_id)
            .unwrap();
        let performances = archive.format_into_performances(event, &data_dir).await?;
        all_performances.extend(performances);
    }
    println!("{:?}", all_performances);
    for performance in all_performances {
        dynamodb_client.put_performance(performance).await?;
    }
    Ok(())
}
