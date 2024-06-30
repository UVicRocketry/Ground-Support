import { Alert, Snackbar } from '@mui/material';
import { 
	createContext, 
	PropsWithChildren, 
	useContext, 
	useEffect, 
	useState, 
	useReducer 
} from 'react';
import useWebSocket from 'react-use-websocket';

export type Packet = {
	data: {
		altitude: number;
		latitude?: number;
		longitude?: number;
		call_sign?: string;
	};
	id: number;
}

enum Protocol {
	APRS = 'APRS',
	LoRa = 'LoRa'
}

type IncomingPacket = {
	type: 'data' | 'no_data_available';
	packets: Packet[];
	last_id: number;
}; 

export interface SocketContext {
	gpsLock: boolean;
	isConnected: boolean;
	packetStreamingInterval: number;
	updatePacketStreamingInterval: (interval: number) => void;
	toggleConnection: () => void;
	logs: Packet[];
	packet: Packet;
	frequency: number;
	updateFrequency: (frequency: number) => void;
	protocol: string;
	updateProtocol: (protocol: Protocol) => void;
}

export const Context = createContext<SocketContext>({
	gpsLock: false,
	isConnected: false,
	packetStreamingInterval: 2,
	updatePacketStreamingInterval: (interval: number) => {},
	toggleConnection: () => {},
	logs: [],
	packet: {} as Packet,
	frequency: 433.92,
	updateFrequency: (frequency: number) => {},
	protocol: Protocol.APRS,
	updateProtocol: (protocol: Protocol) => {}
});

function packetReducer(state: Packet, action: { type: string; payload: any }) {
	switch (action.type) {
		case 'SET_PACKET':
			return action.payload;

		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
}

export const SocketGateway = ({ children }: PropsWithChildren<any>) => {
	const [logs, setLogs] = useState<Packet[]>([]);
	const [packet, packetDispatch] = useReducer(packetReducer, {} as Packet);
	const [frequency, setFrequency] = useState<number>(433.92);
	const [protocol, setProtocol] = useState<string>('APRS');
    const [isConnected, setIsConnect] = useState<boolean>(false);
	const [gpsLock, setGpsLock] = useState<boolean>(false);
	const [wsError, setWsError] = useState<any | null>(null);
	const [packetStreamingInterval, setPacketStreamingInterval] = useState<number>(2); // Packets collected from the telemetry server sent every X seconds

	const port = import.meta.env.TELEMETRY_SERVER_PORT ? import.meta.env.TELEMETRY_SERVER_PORT : 9193;
	const [uri, setUri] = useState<string | null>(isConnected ? `ws://localhost:${9193}` : null);


	const updateFrequency = (frequency: number) => {
		setFrequency(frequency);
	};

	const updateProtocol = (protocol: Protocol) => {
		setProtocol(protocol);
	};

	const updatePacketStreamingInterval = (interval: number) => {
		setPacketStreamingInterval(interval);
	}

	const {
		sendJsonMessage,
        lastJsonMessage
	} = useWebSocket(uri, {
		shouldReconnect: (_) => isConnected,
		onClose: (closeEvent) => {
			setIsConnect(false);
			console.log('Socket Closed:', closeEvent);
		}, 
		onError: (error) => {
			setWsError(error);
			console.log('Socket Error:', error);
		},
		onOpen: () => {
			console.log('Telemetry socket Opened');
			setIsConnect(true);
			sendJsonMessage({ type: 'establish_stream', frequency: packetStreamingInterval });
		},
		share: true
	});

	const toggleConnection = () => {
        setIsConnect(prevIsConnected => {
            if (prevIsConnected) {
                // If the WebSocket is currently connected, disconnect it
                setUri(null);
            } else {
                // If the WebSocket is currently disconnected, connect it
                setUri(`ws://localhost:${port}`);
            }
            return !prevIsConnected;
        });
    };


	const handleIncomingPacket = (data: IncomingPacket) => {
		if (data.type === 'data') {
			const packet = data.packets.find((packet) => packet.id === data.last_id);
			packetDispatch({ type: 'SET_PACKET', payload: packet });
			setLogs((prevLogs) => [...prevLogs, ...data.packets]);	
		}
	}

	useEffect(() => {
		if (lastJsonMessage) {
			handleIncomingPacket(lastJsonMessage as IncomingPacket);
		}
	}, [lastJsonMessage]);

	return (
		<Context.Provider
			value={{
				isConnected,
				gpsLock,
				packetStreamingInterval,
				updatePacketStreamingInterval,
				toggleConnection,
				logs,
				packet,
				frequency,
				updateFrequency,
				protocol,
				updateProtocol
			}}
		>
			<Snackbar
				open={wsError !== null}
				message="Could not connect to socket server"
				autoHideDuration={6000}
			>
				<Alert variant='filled' severity="error" onClose={() => setWsError(null)}>Could not connect to socket server</Alert>				
			</Snackbar>
			{children}
		</Context.Provider>
	);
};

export const useSocketContext = () => useContext<SocketContext>(Context);
