import { useTheme } from '@emotion/react';
import { Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSocketContext } from '../../utils/socket-context';

const TelemetryAltitudeGraph: React.FC = () => {
    const theme = useTheme();
    const socketContext = useSocketContext();
    interface IAltitudeData {
        Id: number;
        Altitude: number;
    }
    const [data, setData] = useState<IAltitudeData[]>([]);
    useEffect(() => {
        if ((socketContext.packet && socketContext.isConnected && socketContext.packet?.data)) {
            setData((prev) => [
                ...prev,
                {
                    Id: socketContext.packet.id,
                    Altitude: socketContext.packet.data.altitude
                }
            ]);
        }
    }, [socketContext.packet]);

    return (
        <Paper
            sx={{
                borderRadius: 2,
                padding: 2,
                zIndex: 4,
                minWidth: 'fit-content',
                height: '100%'
            }}
        >
            <Typography variant='h6' fontWeight={600}>
                Real Time Altitude
            </Typography>
            <ResponsiveContainer
                width="100%"
                height={208}
            >
                <LineChart
                    data={data}
                >
                    <XAxis
                        dataKey="Id"
                        domain={['auto', 'auto']}
                    />
                    <YAxis
                        orientation='right'
                        dataKey={"Altitude"}
                        domain={[0, 'auto']}
                    />
                    <Tooltip />
                    {/* <Legend/> */}
                    <Line
                        type="monotone"
                        dataKey="Altitude"
                        //@ts-ignore
                        stroke={theme.palette.uvr.red}
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default TelemetryAltitudeGraph;
