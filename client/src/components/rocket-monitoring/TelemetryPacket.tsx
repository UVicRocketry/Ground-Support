import { Button, Chip, Icon, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../utils/socket-context';
import { Badge, Height, ShowChart, HorizontalRule, Timer, Numbers } from '@mui/icons-material';



const TelemetryPacket: React.FC = () => {
    const socketContext = useSocketContext();

    const [packetId, setPacketId] = useState<number>(0);
    const [altitude, setAltitude] = useState<number>(0);

    useEffect(() => {
        if ((socketContext.packet && socketContext.isConnected && socketContext.packet?.data)) {
            setPacketId(socketContext.packet.id);
            setAltitude(socketContext.packet.data.altitude);
        }
    }, [packetId, socketContext.packet]);

    interface IPacketContent {
        label: string;
        value: string | number;
        icon: any;
    }

    const content: IPacketContent[] = [
        {
            label: 'Call Sign',
            value: 'N/A',
            icon: <Badge />
        },
        {
            label: 'Altitude',
            value: `${altitude} ft`,
            icon: <ShowChart />
        },
        {
            label: 'Longitude',
            value: 'NAN °',
            icon: <Height />
        },
        {
            label: 'Latitude',
            value: 'NAN °',
            icon: <HorizontalRule />
        }
    ];

    return (
        <Paper
            sx={{     
                borderRadius: 2,
                padding: 2,
                minWidth: 'fit-content',
                height: 'fit-content'
            }}
        >
            <Stack spacing={2} direction={'column'}>
                <Typography variant='h6' fontWeight={600}>
                    Most Recent Packet
                </Typography>
                {content.map((item: IPacketContent, index: number) => (
                    <Stack direction={'row'} justifyContent={'space-between'} key={index}>
                        <Stack spacing={1} direction={'row'} alignItems={'center'}>
                            {item.icon}
                            <Typography fontWeight={500}>
                                {item.label}
                            </Typography>
                        </Stack>
                        <Chip
                            label={item.value} 
                            sx={{ 
                                fontWeight: 600, 
                                borderRadius: 1 
                            }} 
                            color='default' 
                            size='small'
                        />
                    </Stack>
                ))}
                <Chip 
                    label={`Packet Id: ${packetId}`}
                    icon={<Numbers />}
                    size='medium'
                    sx={{ 
                        fontWeight: 600, 
                        borderRadius: 1 
                    }} 
                    color='primary'
                />
            </Stack>
        </Paper>
    );
}

export default TelemetryPacket;
