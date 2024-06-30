import React, { useState, useEffect } from "react";
import { Button, Chip, InputAdornment, Paper, Stack, TextField, TextareaAutosize, Tooltip } from "@mui/material";
import { Box } from "@mui/material";
import { Download } from "@mui/icons-material";
import GpsOffIcon from '@mui/icons-material/GpsOff';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TimerIcon from '@mui/icons-material/Timer';
import { IAprsTelemetryPacket, formatPacket } from "../../utils/TelemetryTypes";
import { useActiveMission } from "../../utils/ActiveMissionContext";
import { saveAs } from "file-saver";
import { Packet, useSocketContext } from "../../utils/socket-context";
import { useTheme } from "@emotion/react";

const TelemetryLog: React.FC = () => {
    const [timeSincePacket, setTimeSincePacket] = useState<number>(0);
    const [logs, setLogs] = useState<string[]>([]);
    const socketContext = useSocketContext();
    const theme = useTheme();

    const exportLog = () => {
        const blob = new Blob([JSON.stringify(socketContext.logs)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "packet-log.txt");
    }

    useEffect(() => {
        formatLog();
        setTimeSincePacket(0);
    }, [socketContext.packet]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSincePacket((prev) => prev + 1);
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [timeSincePacket]);

    const formatLog = () => {
        const newLogs = socketContext.logs.map((packet: Packet) => {
            if (socketContext.packet.id - packet.id < 2) {
                return `[${new Date().toLocaleTimeString()}] Id:${packet.id} - Altitude: ${packet.data.altitude}`;
            }
            return undefined;
        }).filter(log => log !== undefined);

        setLogs([...logs, ...newLogs as string[]]);
    };

    return (
        <Paper 
            sx={{
                borderRadius: 2,
                width: '100%',
                minWidth: 'fit-content',
                height: 'fit-content'
            }}
        >
            <Stack direction={"column"} width={'100%'}>
                <TextareaAutosize
                    style={{
                        border: "none",
                        //@ts-ignore
                        backgroundColor: theme.palette.background.default,
                        color: "#ffffff",
                        paddingTop: '20px',
                        paddingLeft: '20px',
                        maxWidth: `100%`,
                        width: '99%',
                    }}
                    minRows={50}
                    maxRows={12}
                    readOnly
                    placeholder="Telemetry Log"
                    value={logs.join('\n')}
                />
                <Stack direction={'row'} bottom={0}>
                    {[
                        'uvr.red',
                        'uvr.yellow',
                        'uvr.lightBlue',
                        'uvr.darkBlue'
                    ].map((c) => <Box sx={{backgroundColor: c}} width={'25%'} height={10}/>)}
                </Stack>
                <Stack direction='row' padding={2} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction='row' gap={2}>
                        <Chip
                            icon={<TimerIcon />}
                            sx={{ 
                                borderRadius: 2,
                                fontWeight: 600 
                            }}
                            label={`Time since: ${timeSincePacket} s`}
                        />
                    </Stack>
                    <Button 
                        variant={"contained"} 
                        color="primary"
                        startIcon={<Download />}
                        onClick={exportLog}
                    > 
                        Packet Log 
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

export default TelemetryLog;