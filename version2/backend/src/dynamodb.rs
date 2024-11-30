use std::collections::HashMap;

use aws_sdk_dynamodb::types::AttributeValue;
use serde::Serialize;

use crate::{google::UserInfoResponse, OpaqueError};

fn get_string_from_attribute_value_map(
    map: &HashMap<String, AttributeValue>,
    key: &str,
) -> Result<String, OpaqueError> {
    let value = map
        .get(key)
        .ok_or(format!("no {}", key))?
        .as_s()
        .map_err(|v| format!("invalid {}, {:?}", key, v))?;
    Ok(value.clone())
}

fn get_i64_from_attribute_value_map(
    map: &HashMap<String, AttributeValue>,
    key: &str,
) -> Result<i64, OpaqueError> {
    let value = map
        .get(key)
        .ok_or(format!("no {}", key))?
        .as_n()
        .map_err(|v| format!("invalid {}, {:?}", key, v))?
        .parse::<i64>()?;
    Ok(value.clone())
}

fn get_map_list_from_attribute_value_map<'a>(
    map: &'a HashMap<String, AttributeValue>,
    key: &str,
) -> Result<Vec<&'a HashMap<String, AttributeValue>>, OpaqueError> {
    let value = map
        .get(key)
        .ok_or(format!("no {}", key))?
        .as_l()
        .map_err(|v| format!("invalid {}, {:?}", key, v))?
        .iter()
        .map(|v| v.as_m().map_err(|v| format!("invalid {}, {:?}", key, v)))
        .collect::<Result<Vec<_>, _>>()?;
    Ok(value)
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisteredUser {
    pub email: String,
}

impl TryFrom<HashMap<String, AttributeValue>> for RegisteredUser {
    type Error = OpaqueError;
    fn try_from(value: HashMap<String, AttributeValue>) -> Result<Self, Self::Error> {
        let email = get_string_from_attribute_value_map(&value, "email")?;
        Ok(Self { email })
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    event_id: String,
    date: i64,
    place: String,
    title: String,
}

impl Event {
    pub fn get_date(&self) -> i64 {
        self.date
    }
}

impl TryFrom<HashMap<String, AttributeValue>> for Event {
    type Error = OpaqueError;
    fn try_from(value: HashMap<String, AttributeValue>) -> Result<Self, Self::Error> {
        let event_id = get_string_from_attribute_value_map(&value, "event_id")?;
        let date = get_i64_from_attribute_value_map(&value, "date")?;
        let place = get_string_from_attribute_value_map(&value, "place")?;
        let title = get_string_from_attribute_value_map(&value, "title")?;
        Ok(Self {
            event_id,
            date,
            place,
            title,
        })
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Track {
    artist: String,
    title: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Performance {
    event_id: String,
    performance_order: i64,
    performer_name: String,
    start_time: i64,
    end_time: i64,
    track_list: Vec<Track>,
}

impl Performance {
    pub fn get_performance_order(&self) -> i64 {
        self.performance_order
    }

    pub fn filter_out_track_list(&mut self) {
        self.track_list = vec![];
    }
}

impl TryFrom<HashMap<String, AttributeValue>> for Performance {
    type Error = OpaqueError;
    fn try_from(value: HashMap<String, AttributeValue>) -> Result<Self, Self::Error> {
        let event_id = get_string_from_attribute_value_map(&value, "event_id")?;
        let performance_order = get_i64_from_attribute_value_map(&value, "performance_order")?;
        let performer_name = get_string_from_attribute_value_map(&value, "performer_name")?;
        let start_time = get_i64_from_attribute_value_map(&value, "start_time")?;
        let end_time = get_i64_from_attribute_value_map(&value, "end_time")?;
        let track_list = get_map_list_from_attribute_value_map(&value, "track_list")?
            .iter()
            .map(|track| {
                let artist = get_string_from_attribute_value_map(track, "artist").unwrap();
                let title = get_string_from_attribute_value_map(track, "title").unwrap();
                Track { artist, title }
            })
            .collect();
        Ok(Self {
            event_id,
            performance_order,
            performer_name,
            start_time,
            end_time,
            track_list,
        })
    }
}

const USER_TABLE_NAME: &str = "matsuri-official-site_user";
const EVENT_TABLE_NAME: &str = "matsuri-official-site_event";
const PERFORMANCE_TABLE_NAME: &str = "matsuri-official-site_performance";
const EVENT_ID_KEY_NAME: &str = "event_id";
const PERFORMER_ORDER_KEY_NAME: &str = "performance_order";

struct DynamodbKey {
    key_name: String,
    key_value: AttributeValue,
}

pub struct DynamodbProcesser {
    dynamodb_client: aws_sdk_dynamodb::Client,
}

impl DynamodbProcesser {
    pub async fn new() -> Self {
        let config = aws_config::load_from_env().await;
        let dynamodb_client = aws_sdk_dynamodb::Client::new(&config);
        Self { dynamodb_client }
    }

    async fn scan_items<T>(&self, table_name: &str) -> Result<Vec<T>, OpaqueError>
    where
        T: TryFrom<HashMap<String, AttributeValue>, Error = OpaqueError>,
    {
        let scan_output = self
            .dynamodb_client
            .scan()
            .table_name(table_name)
            .select(aws_sdk_dynamodb::types::Select::AllAttributes)
            .send()
            .await?;
        let items: Vec<HashMap<String, AttributeValue>> = scan_output.items.ok_or("no items")?;
        let deserialized_items = items
            .into_iter()
            .map(|item| item.try_into())
            .collect::<Result<Vec<T>, OpaqueError>>()?;
        Ok(deserialized_items)
    }

    async fn query_items<T>(
        &self,
        table_name: &str,
        key_name: &str,
        key_value: &str,
    ) -> Result<Vec<T>, OpaqueError>
    where
        T: TryFrom<HashMap<String, AttributeValue>, Error = OpaqueError>,
    {
        let query_output = self
            .dynamodb_client
            .query()
            .table_name(table_name)
            .select(aws_sdk_dynamodb::types::Select::AllAttributes)
            .key_condition_expression(format!("{} = :key_value", key_name))
            .expression_attribute_values(":key_value", AttributeValue::S(key_value.to_string()))
            .send()
            .await?;
        let items: Vec<HashMap<String, AttributeValue>> = query_output.items.ok_or("no items")?;
        let deserialized_items = items
            .into_iter()
            .map(|item| item.try_into())
            .collect::<Result<Vec<T>, OpaqueError>>()?;
        Ok(deserialized_items)
    }

    async fn get_item<T>(
        &self,
        table_name: &str,
        partition_key: DynamodbKey,
        sort_key: Option<DynamodbKey>,
    ) -> Result<T, OpaqueError>
    where
        T: TryFrom<HashMap<String, AttributeValue>, Error = OpaqueError>,
    {
        let mut get_item = self
            .dynamodb_client
            .get_item()
            .table_name(table_name)
            .key(partition_key.key_name, partition_key.key_value);
        if let Some(sort_key) = sort_key {
            get_item = get_item.key(sort_key.key_name, sort_key.key_value);
        }
        let get_item_output = get_item.send().await?;
        let item: HashMap<String, AttributeValue> = get_item_output.item.ok_or("no items")?;
        let deserialized_item = item.try_into()?;
        Ok(deserialized_item)
    }

    pub async fn is_registered_user(
        &self,
        user_info_response: &UserInfoResponse,
    ) -> Result<bool, OpaqueError> {
        let users: Vec<RegisteredUser> = self.scan_items(USER_TABLE_NAME).await?;
        if users
            .iter()
            .any(|user| user.email == user_info_response.email)
        {
            return Ok(true);
        }
        Ok(false)
    }

    pub async fn list_events(&self) -> Result<Vec<Event>, OpaqueError> {
        self.scan_items(EVENT_TABLE_NAME).await
    }

    pub async fn get_event(&self, event_id: &str) -> Result<Event, OpaqueError> {
        self.get_item(
            EVENT_TABLE_NAME,
            DynamodbKey {
                key_name: EVENT_ID_KEY_NAME.to_string(),
                key_value: AttributeValue::S(event_id.to_string()),
            },
            None,
        )
        .await
    }

    pub async fn list_performances(&self) -> Result<Vec<Performance>, OpaqueError> {
        self.scan_items(PERFORMANCE_TABLE_NAME).await
    }

    pub async fn list_event_performances(
        &self,
        event_id: &str,
    ) -> Result<Vec<Performance>, OpaqueError> {
        self.query_items(PERFORMANCE_TABLE_NAME, EVENT_ID_KEY_NAME, event_id)
            .await
    }

    pub async fn get_performance(
        &self,
        event_id: &str,
        performance_order: u32,
    ) -> Result<Performance, OpaqueError> {
        self.get_item(
            PERFORMANCE_TABLE_NAME,
            DynamodbKey {
                key_name: EVENT_ID_KEY_NAME.to_string(),
                key_value: AttributeValue::S(event_id.to_string()),
            },
            Some(DynamodbKey {
                key_name: PERFORMER_ORDER_KEY_NAME.to_string(),
                key_value: AttributeValue::N(performance_order.to_string()),
            }),
        )
        .await
    }
}

#[cfg(test)]
mod test {

    use dotenvy::dotenv;

    use super::*;

    #[tokio::test]
    async fn test_is_registered_user() {
        dotenv().ok();
        let dynamodb_processer = DynamodbProcesser::new().await;
        let user_info_response = UserInfoResponse {
            sub: "".to_string(),
            name: "".to_string(),
            picture: "".to_string(),
            email: "test_registered@unronritaro.net".to_string(),
        };
        let is_registered_user = dynamodb_processer
            .is_registered_user(&user_info_response)
            .await
            .unwrap();
        assert_eq!(is_registered_user, true);
        let user_info_response = UserInfoResponse {
            sub: "".to_string(),
            name: "".to_string(),
            picture: "".to_string(),
            email: "test_not_registered@unronritaro.net".to_string(),
        };
        let is_registered_user = dynamodb_processer
            .is_registered_user(&user_info_response)
            .await
            .unwrap();
        assert_eq!(is_registered_user, false);
    }

    #[tokio::test]
    async fn test_list_events() {
        dotenv().ok();
        let dynamodb_processer = DynamodbProcesser::new().await;
        let events = dynamodb_processer.list_events().await.unwrap();
        println!("{:?}", events);
    }

    #[tokio::test]
    async fn test_get_event() {
        dotenv().ok();
        let dynamodb_processer = DynamodbProcesser::new().await;
        let event = dynamodb_processer.get_event("2024").await.unwrap();
        println!("{:?}", event);
    }

    #[tokio::test]
    async fn test_list_performances() {
        dotenv().ok();
        let dynamodb_processer = DynamodbProcesser::new().await;
        let performances = dynamodb_processer.list_performances().await.unwrap();
        println!("{:?}", performances);
    }

    #[tokio::test]
    async fn test_list_event_performances() {
        dotenv().ok();
        let dynamodb_processer = DynamodbProcesser::new().await;
        let performances = dynamodb_processer
            .list_event_performances("2024")
            .await
            .unwrap();
        println!("{:?}", performances);
    }

    #[tokio::test]
    async fn test_get_performances() {
        dotenv().ok();
        let dynamodb_processer = DynamodbProcesser::new().await;
        let performances = dynamodb_processer.get_performance("2024", 1).await.unwrap();
        println!("{:?}", performances);
    }
}
