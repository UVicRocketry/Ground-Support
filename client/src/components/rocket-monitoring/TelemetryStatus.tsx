import { Button, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../utils/socket-context';

import { GpsFixed, GpsOff, GpsNotFixed } from '@mui/icons-material';

interface ITelemetryStatusProps {
    launchAltitude?: number;
}

const TelemetryStatus: React.FC<ITelemetryStatusProps> = (props: ITelemetryStatusProps) => {
    const socketContext = useSocketContext();

    const [protocol, setProtocol] = useState<string>('APRS');
    useEffect(() => {
        setProtocol(socketContext.protocol);
    }, [socketContext.protocol]);

    const [frequency, setFrequency] = useState<number>(433.92);
    useEffect(() => {
        setFrequency(socketContext.frequency);
    }, [socketContext.frequency]);

    const [packetRetrievalFrequency, setPacketRetrievalFrequency] = useState<number>(socketContext.packetStreamingInterval);
    useEffect(() => {
        setPacketRetrievalFrequency(socketContext.packetStreamingInterval);
    }, [socketContext.packetStreamingInterval]);

    return (
        <Paper
            sx={{     
                borderRadius: 2,
                padding: 2
            }}
        >
            <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant='h6' fontWeight={600}>Telemetry Information</Typography>
                <Stack spacing={2} direction={'row'} alignItems={'center'}>
                    <Tooltip title={'GPS Lock if green'}>
                        <IconButton 
                            disabled={!socketContext.isConnected}
                            color={socketContext.gpsLock ? 'success' : 'error'}
                        >
                            {socketContext.isConnected ? 
                                socketContext.gpsLock ? 
                                    (<GpsFixed />) 
                                    : ( <GpsNotFixed/>) 
                            : (
                                <GpsOff />
                            )}   
                        </IconButton>
                    </Tooltip>
                    <Chip
                        label={`Packet retrieval rate: ${packetRetrievalFrequency} s`} 
                        sx={{ 
                            fontWeight: 600, 
                            borderRadius: 1 
                        }} 
                        color='default' 
                    />
                    <Chip
                        label={`Frequency: ${frequency} MHz`} 
                        sx={{ 
                            fontWeight: 600, 
                            borderRadius: 1 
                        }} 
                        color='default' 
                    />
                    <Chip 
                        label={`Protocol: ${protocol}`} 
                        sx={{ 
                            fontWeight: 600, 
                            borderRadius: 1 
                        }} 
                        color='default' 
                    />
                </Stack>
            </Stack>
        </Paper>
    );
}

export default TelemetryStatus;