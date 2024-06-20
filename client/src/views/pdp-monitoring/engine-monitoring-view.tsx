import React, { useEffect, useState, useReducer, useCallback } from "react";

// Utils
import api from "../../services/api";

// Icons
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';

// Panels
import ControlsPanel from "../../components/pdp-monitoring/ControlsPanel";

// Components UI

import { Box, Button, Grid, Paper, Stack, Typography, Tooltip, Fab, useTheme, useMediaQuery, BottomNavigation, BottomNavigationAction, ButtonGroup } from "@mui/material";
import Header, { Breadcrumb } from "../../components/Header";
import StartSequencePanel from "../../components/pdp-monitoring/StartSequencePanel";
import InstrumentationPanel from "../../components/pdp-monitoring/InstrumentationPanel";
import ConnectionDialog from "../../components/pdp-monitoring/ConnectionDialog";
import { Chat, InsertInvitation, Settings } from "@mui/icons-material";
import { useMonitoringSocketContext } from "../../utils/monitoring-system/monitoring-socket-context";
import EngineLogDialog from "../../components/logging/EngineLog";
import ConfigurationDialog, { IConfiguration } from "../../components/pdp-monitoring/ConfigurationDialog";
import groundSupportDarkMode from  "../../static/images/groundSupportDarkMode.svg"
import useWebSocket from "react-use-websocket";
import { ControlsActionTypes, ControlsCommandTypes, ControlsValveTypes, IControlsPacket, PacketType } from "../../utils/monitoring-system/monitoring-types";
import { ViewKeys } from "../../utils/viewProviderContext";
import FeedSystem from "../../components/pdp-monitoring/feed-system/FeedSystem";
import { ReactFlowProvider } from "reactflow";

interface IPhoneViewProps {
   openSettings: () => void;
   openLog: () => void;
}

const PhoneView: React.FC<IPhoneViewProps> = (props: IPhoneViewProps) => {
    return(
        <Box sx={{ width: '100vw', height: '100vh' }}>
            <Paper elevation={5} sx={{ padding: 2, borderRadius: 0 }}>
                <Stack direction="row" alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction="row" alignItems={'center'} spacing={2}>
                        <img src={groundSupportDarkMode} alt="Ground Support Icon" height={30}/>
                        <Typography align='left' variant='h6' fontWeight={'bold'}>
                            PDP Monitoring
                        </Typography>
                    </Stack> 
                </Stack>
            </Paper>  
            <Stack
                height={'100%'}
                padding={3}
                direction="column"
                gap={3}
                overflow={'none'}
                alignItems={'center'}
            >
                {/* <InstrumentationPanel phone /> */}
                <ControlsPanel />
                <Stack direction="row" spacing={2} sx={{ position: "absolute", bottom: 20 }}>
                    <Fab 
                        color="primary"
                        onClick={() => props.openLog()}
                        sx={{ borderRadius: 2 }}
                    >
                        <ForumIcon />
                    </Fab>
                </Stack>
            </Stack>
        </Box>
    );
};
interface IComputerViewProps {
    openSettings: () => void;
    openLog: () => void;
    configuration: IConfiguration;
}

const ComputerView: React.FC<IComputerViewProps> = (props: IComputerViewProps) => {
    const colors: string[] = [
		'rgba(255, 197, 87, 1)',
		'rgba(214, 91, 79, 1)',
		'rgba(0, 94, 184, 1)',
		'rgba(69, 136, 201, 1)'
	];
    const socketContext = useMonitoringSocketContext();
	const breadCrumbs: Breadcrumb[] = [
		{ name: 'Ground Support', viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: false },
		{ name: 'Engine Monitoring', viewKey: ViewKeys.PDP_MONITORING_KEY, active: true }
	];
    
    const [currentPacket, setCurrentPacket] = useState({});

    useEffect(() => {
        if (currentPacket) {
            setCurrentPacket(socketContext.missionControlLogs);
        }
    }, [currentPacket]);


    // const {
    //     lastJsonMessage
    // } = useWebSocket(`ws://localhost:8080`, {
    //     onOpen: () => console.log('Connected to MCB'),
    //     shouldReconnect: (closeEvent) => true
    // });


    // useEffect(() => {
    //     if (lastJsonMessage) {
    //         let receivedValve: any | ControlsValveTypes;
    //         const valveValue: string = lastJsonMessage && "valve" in (lastJsonMessage as object) 
    //             ? lastJsonMessage['valve'] 
    //             : '';
    //         switch (valveValue)
    //         {
    //             case 'MEV':
    //                 receivedValve = ControlsValveTypes.MEV;
    //                 break;
    //             case 'N2OF':
    //                 receivedValve = ControlsValveTypes.N2OFlow;
    //                 break;
    //             case 'N2OV':
    //                 receivedValve = ControlsValveTypes.N2OVent;
    //                 break;
    //             case 'N2F':
    //                 receivedValve = ControlsValveTypes.N2Flow;
    //                 break;
    //             case 'RTV':
    //                 receivedValve = ControlsValveTypes.RTV;
    //                 break;
    //             case 'NCV':
    //                 receivedValve = ControlsValveTypes.NCV;
    //                 break;
    //             case 'ERV':
    //                 receivedValve = ControlsValveTypes.ERV;
    //                 break;
    //         }

    //         const payload: IControlsPacket = {
    //             identifier: PacketType.CONTROLS,
    //             command: ControlsCommandTypes.CONTROL,
    //             valve: receivedValve,
    //             action: lastJsonMessage['action'] == 'OPEN' ? ControlsActionTypes.OPEN : ControlsActionTypes.CLOSE
    //         };
    //         console.log(payload)
    //         socketContext.setControlsPacketOut(payload)
    //     }
    // }, [lastJsonMessage]);

    return (
        <Box sx={{ width: '100vw', height: '100vh' }}>
            <Stack
                height={'100%'}
                padding={4}
                direction="column"
                gap={4}
                overflow={'none'}
            >
                <Stack direction="row" alignItems={'center'} justifyContent={'space-between'}>
                    <Header icon="ENGINE_MONITORING" breadCrumbs={breadCrumbs} />
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="PDP Configuration" placement="top">
                            <Button variant={'text'} onClick={() =>props.openSettings()}>
                                <Settings />
                            </Button>
                        </Tooltip>
                        <Button 
                            variant={'text'}
                            onClick={() => props.openLog()}
                            >
                            <ForumIcon />
                        </Button>
                        <ButtonGroup
                            variant="contained"
                        >
                            <Tooltip
                                title={"LabJack Status"}
                            >
                                <Button 
                                    disabled={!socketContext.isLabJackOn} 
                                    color={"success"}
                                    aria-readonly
                                    >
                                        LabJack 
                                </Button>
                            </Tooltip>
                            <Tooltip title={"Serial Status"}>
                                <Button 
                                    disabled={!socketContext.isSerialOn} 
                                    aria-readonly
                                    color={"success"}
                                >
                                    Serial
                                </Button>
                            </Tooltip>
                            <Tooltip title={"Valve Cart Status"}>
                                <Button 
                                    disabled={!socketContext.isConnected} 
                                    color={"success"}
                                >
                                    Valve Cart
                                </Button>
                            </Tooltip>
                            <Button 
                                variant="contained" 
                                size={'large'} 
                                startIcon={<WifiTetheringIcon/>} 
                                sx={{ width: 180 }}
                                onClick={() => {
                                    // setOpenConnection(!openConnection);  
                                    socketContext.toggleConnection();
                                }}
                            >
                                {socketContext.connect ? "Disconnect" : "Connect"}
                            </Button>
                        </ButtonGroup>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={2} height={'100%'}>
                    { props.configuration.feedSystemVisualPanel && <ReactFlowProvider><FeedSystem /></ReactFlowProvider>}
                    { props.configuration.controlsPanel && <ControlsPanel />}
                    { props.configuration.instrumentationPanel && <InstrumentationPanel />}
                </Stack>
            </Stack>
            <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                {colors.map((color) => {
                    return (
                        <div
                            key={color}
                            style={{
                                backgroundColor: color,
                                width: '25%',
                                height: '1vh',
                                float: 'left'
                            }}
                        />
                    );
                })}
            </div>
           
        </Box>
    );
}

const EngineMonitoringView: React.FC = () => {
    const theme = useTheme();
    const isNotMobile = useMediaQuery(theme.breakpoints.up('sm'));

    // Context initial State
    const socketContext = useMonitoringSocketContext();
    
    const [currentPacket, setCurrentPacket] = useState({});
    const [openConnection, setOpenConnection] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [openLog, setOpenLog] = useState(false);

    const [panelConfiguration, setPanelConfiguration] = useState({
        controlsPanel: false,
        instrumentationPanel: false,
        feedSystemVisualPanel: true
    });

    useEffect(() => {
        if (currentPacket) {
            setCurrentPacket(socketContext.missionControlLogs);
        }
    }, [currentPacket]);

    return (
        <>
            {!isNotMobile ?
                <PhoneView 
                    openSettings={() => setOpenSettings(true)}
                    openLog={() => setOpenLog(true)}
                />
                :
                <ComputerView 
                    openSettings={() => setOpenSettings(true)}
                    openLog={() => setOpenLog(true)}
                    configuration={panelConfiguration}
                />
            }
            
            <ConnectionDialog 
                isOpen={openConnection} 
                onClose={() => setOpenConnection(false)}
            />
            <EngineLogDialog
                dialog={true}
                onClose={() => setOpenLog(false)}
                isOpen={openLog}
                isMobile={!isNotMobile}
            />
            <ConfigurationDialog 
                isOpen={openSettings} 
                configuration={panelConfiguration}
                setConfiguration={setPanelConfiguration}
                onClose={() => setOpenSettings(false)}
            />
        </>
    );
    
}

export default EngineMonitoringView;
