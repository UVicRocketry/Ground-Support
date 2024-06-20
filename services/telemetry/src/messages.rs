//! During a websocket connection, the server and the client exchange messages
//! that are serialized into JSON. This module contains the definition of those
//! messages.

use serde::{Deserialize, Serialize};

use crate::RfProtocol;
use crate::data::DataPacket;

/// A message that is sent between the server and the client inside a websocket
/// text frame.
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(tag = "type")]
pub enum Message {
    #[serde(rename = "change_protocol")]
    ChangeProtocol {
        protocol: RfProtocol,
    },
    #[serde(rename = "change_frequency")]
    ChangeFrequency {
        frequency: f64,
    },
    /// Request information about the current state of the server.
    ///
    /// This is only sent from the client to the server. If the client receives
    /// this, it is considered an error.
    #[serde(rename = "request_status")]
    RequestStatus,
    /// The current state of the server.
    #[serde(rename = "status")]
    Status {
        /// The current set protocol.
        protocol: RfProtocol,
        /// The current set frequency.
        frequency: f64,
        /// The number of seconds since the last packet was received.
        ///
        /// If this is `None`, then no packets have been received yet.
        seconds_since_last_packet: Option<f64>,
        /// The number of packets that have been received.
        packets_received: u64,
        /// The ID of the last packet that was received.
        last_packet_id: Option<u64>,
    },
    /// Sent by the client to the server to request the lastest data.
    ///
    /// The server will then either response with a [`Message::Data`] message
    /// containing the latest data since the last message id given, or a
    /// [`Message::NoDataAvailable`] message if there is no data available since
    /// the last packet ID that the client has.
    #[serde(rename = "poll_data")]
    PollData {
        last_packet_id: Option<u64>
    },
    /// Sent by the server to the client to send the latest data.
    #[serde(rename = "data")]
    Data {
        last_id: u64,
        packets: Vec<DataPacket>,
    },
    /// Sent by the server to the client to indicate that there is no data
    /// available since the last packet ID that the client has.
    ///
    /// Send both in response to a [`Message::PollData`] message, and when the
    /// session is in streaming mode and there is no data available at the
    /// defined interval.
    #[serde(rename = "no_data_available")]
    NoDataAvailable,
    /// Sent by the client to the server to change the server to streaming mode.
    #[serde(rename = "establish_stream")]
    EstablishStream { frequency: f64 },
    /// Sent by the server to acknowledge that the stream has been established.
    #[serde(rename = "stream_established")]
    StreamEstablished { frequency: f64 },
    /// Sent by the client to the server to end the stream.
    #[serde(rename = "end_stream")]
    EndStream,
    /// Sent by the server to the client to indicate that the stream has ended.
    #[serde(rename = "stream_ended")]
    StreamEnded,
}

impl Message {
    pub fn json(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

    pub fn from_json(json: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(json)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_message_serialize() {
        let msg = Message::ChangeProtocol { protocol: RfProtocol::Aprs };

        let json = serde_json::to_string(&msg).unwrap();

        assert_eq!(json, r#"{"type":"change_protocol","protocol":"aprs"}"#);
    }

    #[test]
    fn test_message_deserialize_change_protocol() {
        let raw = r#"{"type":"change_protocol","protocol":"aprs"}"#;

        let msg: Message = serde_json::from_str(raw).unwrap();

        match msg {
            Message::ChangeProtocol { protocol } => {
                assert_eq!(protocol, RfProtocol::Aprs);
            },
            _ => panic!("Invalid message type"),
        }
    }

    #[test]
    fn test_message_serialize_change_frequency() {
        let msg = Message::ChangeFrequency { frequency: 920523.0 };

        let json = serde_json::to_string(&msg).unwrap();

        assert_eq!(json, r#"{"type":"change_frequency","frequency":920523.0}"#);
    }
}