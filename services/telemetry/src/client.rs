//! This is a client built for testing the server.

use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{WebSocketStream, MaybeTlsStream};
use tokio_tungstenite::tungstenite::Message as WsMessage;

use crate::messages::Message as UvrMessage;

async fn receive_message<S>(socket: &mut WebSocketStream<S>) -> Option<UvrMessage>
    where S: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin
{
    let msg = socket.next().await?;

    let msg = match msg {
        Err(e) => {
            println!("Error receiving message: {}", e);
            return None;
        },
        Ok(msg) => msg,
    };

    let msg = match msg {
        WsMessage::Text(msg) => msg,
        _ => {
            println!("Invalid message type received");
            return None;
        },
    };

    let msg: UvrMessage = match serde_json::from_str(&msg) {
        Ok(msg) => msg,
        Err(e) => {
            println!("Error parsing message: {}", e);
            return None;
        },
    };

    Some(msg)
}

/// Run the client that tests that the server is running correctly.
pub async fn run_client(address: String) {
    let address = match address.split_once("://") {
        Some(_) => address,
        None => format!("ws://{}", address),
    };
    let (mut socket, _) = tokio_tungstenite::connect_async(&address).await.unwrap();

    let msg = WsMessage::Text(UvrMessage::RequestStatus.json());
    socket.send(msg).await.unwrap();

    let msg = receive_message(&mut socket).await.unwrap();
    println!("Received message: {msg:?}");

    let msg = WsMessage::Text(UvrMessage::ChangeProtocol { protocol: crate::RfProtocol::Aprs }.json());
    socket.send(msg).await.unwrap();
    let msg = WsMessage::Text(UvrMessage::ChangeFrequency { frequency: 920523.0 }.json());
    socket.send(msg).await.unwrap();

    let msg = WsMessage::Text(UvrMessage::RequestStatus.json());
    socket.send(msg).await.unwrap();

    let msg = receive_message(&mut socket).await.unwrap();
    println!("Received message: {msg:?}");

    let msg = WsMessage::Text(UvrMessage::PollData { last_packet_id: None }.json());
    socket.send(msg).await.unwrap();

    let msg = receive_message(&mut socket).await.unwrap();
    println!("Received message: {msg:?}");

    // close the connection
    let msg = WsMessage::Close(None);
    socket.send(msg).await.unwrap();

    println!("Connection closed");
}