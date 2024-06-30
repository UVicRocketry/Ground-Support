use tokio::time::Instant;

use crate::RfProtocol;
use crate::data::DataPacket;
use crate::messages::Message;

#[derive(Debug, Clone)]
pub struct State {
    pub protocol: RfProtocol,
    pub frequency: f64,
    pub last_packet_time: Option<Instant>,
    pub last_packet_id: Option<u64>,
    pub packets_received: u64,
    pub packet_buffer: Vec<DataPacket>,
    /// The offset of the first packet in the packet buffer.
    ///
    /// As packets are received, they are appended to the end of the packet
    /// buffer, but older packets may be removed from the start of the packet
    /// buffer. This offset is used to keep track of the first packet in the
    /// packet buffer.
    pub packet_buffer_offset: u64,
    /// When true, system-wide binaries are used instead of the ones in the repo.
    pub system_binaries: bool
}

impl State {
    pub fn new(protocol: RfProtocol, frequency: f64) -> Self {
        Self {
            protocol,
            frequency,
            last_packet_time: None,
            packets_received: 0,
            last_packet_id: None,
            packet_buffer: Vec::new(),
            packet_buffer_offset: 0,
            system_binaries: false
        }
    }

    pub fn append_packet(&mut self, packet: DataPacket) {
        self.packets_received += 1;
        self.last_packet_time = Some(Instant::now());
        self.last_packet_id = Some(packet.id);

        self.packet_buffer.push(packet);
    }

    pub fn status_message(&self) -> Message {
        Message::Status {
            protocol: self.protocol,
            frequency: self.frequency,
            seconds_since_last_packet: self.last_packet_time.map(|t| t.elapsed().as_secs_f64()),
            packets_received: self.packets_received,
            last_packet_id: self.last_packet_id
        }
    }

    pub fn packets_since<ID>(&self, packet_id: ID) -> &[DataPacket]
        where ID: Into<Option<u64>>
    {
        let packet_id: Option<u64> = packet_id.into();

        let Some(packet_id) = packet_id else {
            return &self.packet_buffer;
        };

        let Some(last_packet_id) = self.last_packet_id else {
            return &[];
        };

        if packet_id >= last_packet_id {
            return &[];
        }

        let start = (packet_id - self.packet_buffer_offset) as usize;
        let end = (last_packet_id - self.packet_buffer_offset) as usize;

        &self.packet_buffer[start..end]
    }

    pub fn get_data_to_stream(&self, packet_id: Option<u64>) -> Option<(u64, Vec<DataPacket>)> {
        let self_last_id = self.last_packet_id?;

        let packets = self.packets_since(packet_id).to_owned();

        if packets.is_empty() {
            return None;
        }

        Some((self_last_id, packets))
    }
}
