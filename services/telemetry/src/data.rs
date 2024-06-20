use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DataPacket {
    pub id: u64,
    pub data: HashMap<String, String>
}