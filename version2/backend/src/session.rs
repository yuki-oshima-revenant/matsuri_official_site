use crate::OpaqueError;
use serde::{Deserialize, Serialize};
use tower_sessions::Session;
use tracing::{error, warn};

pub const SESSION_USER_KEY: &str = "user";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: String,
    pub name: String,
    pub mailaddress: String,
    pub picture_url: String,
}

pub async fn get_user_info_from_session(session: Session) -> Result<User, OpaqueError> {
    let user = match session.get::<User>(SESSION_USER_KEY).await? {
        Some(user) => user,
        None => {
            if false {
                warn!("failed to get user info from session, use dummy user info");
                return Ok(User {
                    id: "test".to_string(),
                    name: "test".to_string(),
                    mailaddress: "test@gmail.com".to_string(),
                    picture_url: "...".to_string(),
                });
            } else {
                error!("failed to get user info from session");
                return Err("failed to get user info from session".into());
            }
        }
    };
    Ok(user)
}
