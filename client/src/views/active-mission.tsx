import React, { useEffect, useState, useReducer, useCallback } from "react";

// Utils
import { useActiveMission } from "../utils/ActiveMissionContext";
import { SocketGateway, useSocketContext } from "../utils/socket-context";
import { useViewProvider, ViewKeys } from '../utils/viewProviderContext';
import { IDataPoint, IMission, IMissionPopulated, IRocketPopulated } from "../utils/entities";
import api from "../services/api";

// Icons
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Views
import StartUpView from './active/startup-view';
import FlightView from './active/flight-view';
import RecoveryView from './active/recovery-view';
import RocketSelectionView from './active/flight-report-view';

// Components UI
import { Button, Grid, Stack, Step, StepButton, Stepper, styled } from "@mui/material";
import SettingsDialog from "../components/SettingsDialog";
import FlightReportView from "./active/flight-report-view";


// Active Mission Keys
const START_UP_KEY = "START_UP";
const FLIGHT_KEY = "FLIGHT";
const RECOVERY_KEY = "RECOVERY";
const FLIGHT_REPORT_KEY = "FLIGHT_REPORT"; 
    

const StyledStepper = styled(Stepper)`
    .MuiStepper-root {
        backgroundcolor: uvr.yellow;
    }
`;

const ActiveMissionView: React.FC = () => {
    const socketContext = useSocketContext();
    const activeMissionContext = useActiveMission();
    const viewProviderContext = useViewProvider();

    function phaseReducer(state: any, action: any) {
        switch (action.type) {
            case START_UP_KEY:
                return {
                    phase: START_UP_KEY,
                    currentView: <StartUpView />
                }
            case FLIGHT_KEY:
                return {
                    phase: FLIGHT_KEY,
                    currentView: <FlightView />
                }
            case RECOVERY_KEY:
                return {
                    phase: RECOVERY_KEY,
                    currentView: <RecoveryView />
                }
            case FLIGHT_REPORT_KEY:
                return {
                    phase: FLIGHT_REPORT_KEY,
                    currentView: <FlightReportView />
                }
            default:
                throw Error(`Unknown action type: ${action.type}`);
            }
    }
    const [rocket, setRocket] = useState<IRocketPopulated>({} as IRocketPopulated);

    const [activePhaseState, activePhaseDispatch] = useReducer(phaseReducer, {
        phase: START_UP_KEY,
        currentView: <StartUpView />
    });

    // Stepper State
    const activeStepKeys = [
        'Start up', 
        'Flight', 
        'Recovery', 
        'Flight Report'
    ];
    
    interface IActiveKeys {
        [key: number]: string;
    }

    const activeKeys: IActiveKeys = {
        0: START_UP_KEY,
        1: FLIGHT_KEY,
        2: RECOVERY_KEY,
        3: FLIGHT_REPORT_KEY
    }

    const [activeStep, setActiveStep] = useState<number>(0);
    const [completedStep, setCompletedStep] = useState<{
		[k: number]: boolean;
	}>({});

    const handleStep = (step: number) => () => {
		setActiveStep(step);
        activePhaseDispatch({ type: activeKeys[step] });
	};

    // Settings Dialog
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
	const handleSettingsDialog = () => {
		setIsSettingsOpen(!isSettingsOpen);
	};

    // Context initial State
    const [mission, setActiveMission] = useState<IMissionPopulated>({} as IMissionPopulated);
    const activeContext = useActiveMission();

    const getActiveMission = useCallback(async () => {
        const mId = activeContext.activeMission._id ? activeContext.activeMission._id : activeContext.missionId;
        if (mId === "") return;
        const response = await api.getMission(mId);
        const data = response.data as IMissionPopulated;
        console.log(data)
        activeContext.updateMission(data);
        setActiveMission(data);
    }, [activeContext.missionId]);

    const getActiveRocket = useCallback(async (): Promise<IRocketPopulated> => {
        const response = await api.getRocket(activeContext.rocketId || '');
        const data = response.data as IRocketPopulated;
        activeContext.updateRocket(data);
        setRocket(data);
        return data;
    }, [activeContext.rocketId]);

    useEffect(() => {
        getActiveRocket();
        // getActiveMission();
    }, []);

    return (
        <SocketGateway>
            <Grid container spacing={2} direction="row">
                {/* Any views should be rendered within this grid item */}
                <Grid item xs={10}>
                    {activePhaseState.currentView}
                </Grid>

                <Grid item xs={2}>
                    <Grid
                        paddingX="1rem"
                        paddingY="1rem"
                        container
                        direction="column"
                        justifyContent="space-between"
                        height="100%"
                        style={{ height: '100vh', overflow: 'auto' }}
                    >
                        <Grid item justifyContent="end" alignContent={'end'}>
                            <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                        </Grid>

                        {/* Page change stepper */}
                        <Grid container justifyContent="center">
                            <StyledStepper 
                                nonLinear 
                                activeStep={activeStep} 
                                orientation="vertical" 
                                sx={{ 'ActiveColor': 'uvr.yellow', '--completed-color': 'uvr.yellow'}}
                            >
                                {activeStepKeys.map((label, index) => (
                                    <Step key={label}  completed={completedStep[index]} >
                                        <StepButton onClick={handleStep(index)}>
                                            {label}
                                        </StepButton>
                                    </Step>
                                ))}
                            </StyledStepper>
                        </Grid>

                        <Grid item>
                            <Stack direction={'row'} gap={2}>
                                <Button
                                    startIcon={<NavigateBeforeIcon />}
                                    fullWidth={true}
                                    variant="contained"
                                    color="primary"
                                    onClick={()=> {
                                        viewProviderContext.updateViewKey(ViewKeys.ROCKET_DETAILS_KEY);
                                    }}
                                >
                                    Back
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SocketGateway>
    );

}

export default ActiveMissionView;
