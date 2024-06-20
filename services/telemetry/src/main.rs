//! This is a WebSocket based application that communicates with the UVic
//! Rocketry Ground Support application, providing data received from the
//! telemetry systems as well as actually processing the data from the telemetry
//! systems.

use std::fmt::Display;
use std::str::FromStr;
use std::sync::{Arc, Mutex};

use clap::Parser;
use serde::{Serialize, Deserialize};

use crate::state::State;

mod client;
mod data;
mod freq_util;
mod messages;
mod server;
mod state;
mod telemetry;

/// The default frequency to use if one is not provided.
///
/// This is the frequency that the UVic Rocketry team uses
/// for their COTS BRB telemetry system.
const DEFAULT_FREQUENCY: f64 = 433.92e6;

/// This is the main command line interface for the application.
#[derive(Parser, Debug, Clone)]
struct Cli {
    /// The address of the socket server that the frontend will need to connect
    /// to.
    #[clap(short, long, default_value = "localhost:9193")]
    address: String,
    /// The frequency that is being transmitted from the rocket.
    #[clap(short, long)]
    frequency: Option<f64>,
    /// The protocol that is being used to transmit the data.
    #[clap(short, long, default_value = "aprs")]
    protocol: RfProtocol,
    /// If this is set, then the application will act as a client instead of a
    /// server. This is currently meant for testing purposes.
    #[clap(long)]
    client: bool,
}

/// A transmission protocol that is used to transmit data from the rocket.
#[derive(Debug, Clone, Copy, Deserialize, Serialize, PartialEq, Eq)]
pub enum RfProtocol {
    #[serde(rename = "aprs")]
    Aprs
}

impl FromStr for RfProtocol {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "aprs" => Ok(RfProtocol::Aprs),
            _ => Err(format!("{} is not a valid protocol", s))
        }
    }
}

impl Display for RfProtocol {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            RfProtocol::Aprs => write!(f, "APRS")
        }
    }
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    if cli.client {
        client::run_client(cli.address).await;
        return;
    }

    let frequency = cli.frequency.unwrap_or(DEFAULT_FREQUENCY);

    let state = State::new(cli.protocol, frequency);
    let state = Arc::new(Mutex::new(state));

    println!("Starting server on {}", cli.address);
    println!("  Frequency: {}", freq_util::display_freq(frequency));
    println!("  Protocol: {}", cli.protocol);

    let mut listener = tokio::net::TcpListener::bind(&cli.address).await.unwrap();

    let mut connection_id = 0;

    let state_ref = state.clone();

    tokio::spawn(async move {
        telemetry::start_telemetry(state_ref).await.unwrap();
    });

    loop {
        let (mut socket, _) = listener.accept().await.unwrap();

        let state_ref = Arc::clone(&state);
        tokio::spawn(async move {
            server::handle_connection(socket, connection_id, state_ref).await;
        });

        connection_id += 1;
    }
}
