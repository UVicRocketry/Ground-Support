use std::sync::{Arc, Mutex};
use std::process::{Command, Stdio, ChildStdout};
use std::io::{self, BufReader, BufRead};
use crate::state::State;
use std::io::Read;
use std::io::prelude::*;
use std::string::FromUtf8Error;
use std::thread::spawn;
use std::collections::HashMap;
use regex::Regex;
use std::str;

use crate::data::DataPacket;

use std::time::Duration;
use std::thread::sleep;

/// Takes one line of a packet as a Vec<u8>
/// Updates the state with information in that line
async fn extract_packets(state_ref: Arc<Mutex<State>>, received_line: Vec<u8>) {
    let data = match str::from_utf8(&received_line) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8: {}", e)
    };
    let mut packet_data: HashMap<String, String> = HashMap::new();

    let callsign_regex = Regex::new(r"([A-Z0-9]+)-\d").unwrap();
    let lat_long_regex = Regex::new(r"(\d{4}\.\d{2}N)/(\d{5}\.\d{2}W)").unwrap();
    let altitude_regex = Regex::new(r"/A=(\d{6})\*").unwrap();

    if let Some(callsign_caps) = callsign_regex.captures(data) {
        let callsign = &callsign_caps[1];
        packet_data.insert("callsign".to_string(), callsign.to_string());
        println!("Callsign: {}", callsign);
    } else {
        packet_data.insert("callsign".to_string(), "".to_string());
        println!("Failed to get callsign");
    }

    if let Some(lat_long_caps) = lat_long_regex.captures(data) {
        let latitude = &lat_long_caps[1];
        let longitude = &lat_long_caps[2];
        packet_data.insert("latitude".to_string(), latitude.to_string());
        packet_data.insert("longitude".to_string(), longitude.to_string());
        println!("Latitude: {}", latitude);
        println!("Longitude: {}", longitude);
    } else {
        packet_data.insert("latitude".to_string(), "".to_string());
        packet_data.insert("longitude".to_string(), "".to_string());
        println!("Failed to get lat long")
    }

    if let Some(altitude_caps) = altitude_regex.captures(data) {
        let altitude = &altitude_caps[1];
        packet_data.insert("altitude".to_string(), altitude.to_string());
        println!("Altitude: {}", altitude);
    } else {
        packet_data.insert("altitude".to_string(), "".to_string());
        println!("Failed to get altitude");
    }

    let packet_id: u64 = match state_ref.lock().unwrap().last_packet_id {
        Some(id) => id.checked_add(1).unwrap_or(1), // Add 1 if possible, otherwise set to 1
        None => 1, // If None, set to 1
    };
    packet_id.checked_add(1);

    let mut packet = DataPacket{
        id: packet_id, data: packet_data
    };
    state_ref.lock().unwrap().append_packet(packet);
}
/// starts telemetry by calling decode.sh which in turn calls linux direwolf and rtl_fm binaries
///
/// calls extract_packets when new data received from rocket
pub async fn start_telemetry(state_ref: Arc<Mutex<State>>) -> io::Result<()> {
    let frequency = state_ref.lock().unwrap().frequency;
    println!("Starting telemetry on {}", frequency);

    let mut decode_aprs = Command::new("sh")
        .arg("./tools/decode_test.sh")
        // .arg(frequency.to_string())
        .stdout(Stdio::piped())
        .spawn()
        .expect("failed to start decoder");
    
    let mut child_out = BufReader::new(decode_aprs.stdout.as_mut().unwrap());
    let mut readbuf = vec![0; 256];
    let mut buffer = Vec::new();

    loop {
        // read() blocks until data is available. This makes this not polling.
        let mut bytes_read = child_out.read(&mut readbuf);
        match bytes_read {
            Ok(value) => {
                let int_bytes_read: i32 = value as i32;
                if (int_bytes_read > 0) {
                    buffer.extend_from_slice(&readbuf[..value]);
                    // Check for two successive newlines
                    if let Some(pos) = buffer.windows(2).position(|window| window == b"\n\n") {
                        // Extract the data before the two newlines
                        let data_to_process = buffer[..pos].to_vec();
                        extract_packets(Arc::clone(&state_ref), data_to_process).await;
                        // Remove the processed data and the two newlines from the buffer
                        buffer.drain(..pos + 2);
                    }
                }
            }
            Err(e) => {
                println!("An error occurred: {}", e);
            }
        }
    }
    Ok(())
}
