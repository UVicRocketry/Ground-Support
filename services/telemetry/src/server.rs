use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::collections::HashMap;

use futures_util::{SinkExt, StreamExt};
use tokio::net::TcpStream;

use tokio_tungstenite::WebSocketStream;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::tungstenite::error::Error as WsError;

use crate::messages::Message as UvrMessage;
use crate::state::State;
use crate::data::DataPacket;

/// A session that is connected to some client.
///
/// This handles a single TCP connection and is closed when that connection is
/// closed.
///
/// There is currently no session authentication, so anyone can connect to the
/// server and send messages to it and change settings. This is not considered
/// a high-priority security issue because the server is only meant to be used
/// locally within the same computer, and not over the internet. If public
/// access to the server is required, then authentication will need to be
/// implemented.
struct Session {
    /// The session ID.
    ///
    /// This is mostly used for logging purposes, so that we can tell which
    /// session is which when there are multiple sessions running at the same
    /// time.
    id: u64,
    /// The websocket stream that is used to communicate with the client.
    stream: WebSocketStream<TcpStream>,
    /// The state of the server.
    ///
    /// This is an `Arc<Mutex<State>>` because we need to be able to share the
    /// state between multiple sessions.
    state_ref: Arc<Mutex<State>>,
    /// The current mode of the session.
    ///
    /// See [`SessionMode`] for more information.
    mode: SessionMode
}

/// The mode that the session is running in.
///
/// This is primarily to determine if the server should only be sending packets
/// when the client requests them, or if the server should be sending packets
/// at a defined interval.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SessionMode {
    /// Only send data to the client when the client requests it.
    Polling,
    /// Only send data to the client every `Duration`.
    ///
    /// Contained duration is the interval at which data is sent.
    Streaming(Duration)
}

impl SessionMode {
    /// Get the duration of the mode.
    ///
    /// This is only valid for the [`SessionMode::Streaming`] variant, however
    /// if the mode is [`SessionMode::Polling`], then this will return
    /// `Duration::from_secs(0)`.
    fn duration(&self) -> Duration {
        match self {
            SessionMode::Polling => Duration::from_secs(0),
            SessionMode::Streaming(d) => *d
        }
    }
}

macro_rules! log {
    ($session:expr, $($arg:tt)*) => {
        println!("{} | {}", $session.id, format!($($arg)*))
    }
}

pub const DEFAULT_SESSION_MODE: SessionMode = SessionMode::Polling;

impl Session {
    /// Create a new session.
    fn new(id: u64, stream: WebSocketStream<TcpStream>, state_ref: Arc<Mutex<State>>) -> Self {
        Self {
            id,
            stream,
            state_ref,
            mode: DEFAULT_SESSION_MODE,
        }
    }

    pub fn set_mode(&mut self, mode: SessionMode) {
        self.mode = mode;
    }

    /// Send a WebSocket close message to the client and log any errors.
    async fn close_connection(&mut self) {
        let msg = Message::Close(None);
        if let Err(e) = self.stream.send(msg).await {
            log!(self, "Error closing connection with client: {}", e);
        }
    }

    /// Handle a message received from the client.
    ///
    /// # Returns
    ///
    /// Tuple of `(should_exit, mode_changed)`.
    async fn handle_message(&mut self, msg: Option<Result<Message, WsError>>) -> (bool, bool) {
        let msg = match msg {
            None => return (true, false),
            Some(Err(e)) => {
                log!(self, "Error receiving message: {}", e);
                return (true, false);
            },
            Some(Ok(msg)) => msg,
        };

        let msg = match msg {
            Message::Text(msg) => msg,
            Message::Close(_) => {
                log!(self, "Connection closed");
                return (true, false);
            },
            _ => {
                log!(self, "Invalid message type received");
                return (true, false);
            },
        };

        let msg = match UvrMessage::from_json(&msg) {
            Ok(msg) => msg,
            Err(e) => {
                log!(self, "Error parsing message: {}", e);
                return (true, false);
            },
        };

        // TODO: Don't use unwrap on the mutex
        match msg {
            UvrMessage::RequestStatus => {
                log!(self, "Received request status message");
                let msg = self.state_ref.lock().unwrap().status_message();
                let msg = Message::Text(msg.json());
                if let Err(e) = self.stream.send(msg).await {
                    log!(self, "Error sending message: {}", e);
                    return (true, false);
                }
            },
            UvrMessage::ChangeFrequency { frequency } => {
                log!(self, "Received change frequency message: {}", frequency);
                self.state_ref.lock().unwrap().frequency = frequency;
            }
            UvrMessage::ChangeProtocol { protocol } => {
                log!(self, "Received change protocol message: {}", protocol);
                self.state_ref.lock().unwrap().protocol = protocol;
            },
            UvrMessage::PollData { last_packet_id } => {
                match self.send_data_since(last_packet_id).await {
                    Ok(Some(id)) => log!(self, "Sent data to client up to {id}"),
                    Ok(None) => log!(self, "No data available to send to client"),
                    Err(e) => {
                        log!(self, "Error sending message: {}", e);
                        return (true, false);
                    }
                }
            }
            UvrMessage::EstablishStream { frequency } => {
                log!(self, "Received establish stream message: {}", frequency);
                self.set_mode(SessionMode::Streaming(Duration::from_secs_f64(frequency)));
                let msg = UvrMessage::StreamEstablished { frequency };
                let msg = Message::Text(msg.json());
                if let Err(e) = self.stream.send(msg).await {
                    log!(self, "Error sending message: {}", e);
                    return (true, false);
                }
                return (false, true);
            },
            _ => {
                log!(self, "Invalid message type received");
                return (true, false);
            },
        }

        (false, false)
    }

    /// Run the session.
    ///
    /// This message does not exit until the connection is closed.
    async fn run(&mut self) {
        loop {
            let should_exit = match self.mode {
                SessionMode::Polling => self.polling_loop().await,
                SessionMode::Streaming(_) => self.streaming_loop().await,
            };

            if should_exit {
                return
            }
        }
    }

    async fn send_data_since(&mut self, last_packet_id: Option<u64>) -> Result<Option<u64>, WsError> {
        let data_to_stream = self.state_ref.lock().unwrap().get_data_to_stream(last_packet_id);

        if let Some((last_id, packets)) = data_to_stream {
            let msg = UvrMessage::Data { last_id, packets };
            let msg = Message::Text(msg.json());
            self.stream.send(msg).await?;

            Ok(Some(last_id))
        } else {
            let msg = UvrMessage::NoDataAvailable;
            let msg = Message::Text(msg.json());
            self.stream.send(msg).await?;

            Ok(None)
        }
    }

    /// Run the session in streaming mode.
    ///
    /// This will run until either the connection is closed or the mode has
    /// changed.
    ///
    /// # Returns
    ///
    /// `true` if the connection should be closed, `false` if the mode has
    /// changed.
    async fn streaming_loop(&mut self) -> bool {
        let mut last_streamed = tokio::time::Instant::now();
        let mut last_streamed_packet_id = None;

        loop {
            tokio::select! {
                // Streaming interval has elapsed.
                _ = tokio::time::sleep_until(last_streamed + self.mode.duration()) => {
                    last_streamed = tokio::time::Instant::now();
                    match self.send_data_since(last_streamed_packet_id).await {
                        Ok(new_last_id) => last_streamed_packet_id = new_last_id,
                        Err(e) => {
                            log!(self, "Error sending message: {}", e);
                            return true;
                        }
                    }
                    last_streamed_packet_id = self.state_ref.lock().unwrap().last_packet_id;
                },
                // A message is received from the client.
                msg = self.stream.next() => {
                    let (should_exit, mode_changed) = self.handle_message(msg).await;

                    if should_exit || mode_changed {
                        return should_exit;
                    }
                }
            };
        }
    }

    /// Run the session in polling mode.
    ///
    /// This will run until either the connection is closed or the mode has
    /// changed.
    ///
    /// # Returns
    ///
    /// `true` if the connection should be closed, `false` if the mode has
    /// changed.
    async fn polling_loop(&mut self) -> bool {
        loop {
            let (should_exit, mode_changed) = tokio::select! {
                // A message is received from the client.
                msg = self.stream.next() => {
                    self.handle_message(msg).await
                }
            };

            if should_exit || mode_changed {
                return should_exit;
            }
        }
    }
}

/// Accept a new connection from the TcpStream given, perform the WebSocket
/// handshake, and then establish the session.
pub async fn handle_connection(
    stream: TcpStream,
    id: u64,
    state_ref: Arc<Mutex<State>>
) {
    let peer_addr = stream.peer_addr().unwrap();
    let accept = tokio_tungstenite::accept_async(stream).await;

    println!("{id} | New connection from {}", peer_addr);

    let stream = match accept {
        Ok(stream) => stream,
        Err(e) => {
            println!("{id} | Error during the websocket handshake occurred: {}", e);
            return;
        },
    };

    let mut session = Session::new(id, stream, state_ref);

    session.run().await;
}