import { 
    createContext, 
    PropsWithChildren, 
    useContext, 
    useReducer,
    useState
} from 'react';
import { 
    IMission,
    IMissionPopulated,
    IRocketPopulated 
} from './entities';
import { formatPacket, IAprsTelemetryPacket, ILoggedTelemetryPacket } from './TelemetryTypes';

export interface IActiveMissionContext {
    missionId: string;
    updateMissionId: (id: string) => void;
    rocketId: string;
    updateRocketId: (id: string) => void;
    dataConfigId: string;
    updateDataConfigId: (id: string) => void;
    activeMission: IMission;
    updateMission: (payload: IMissionPopulated | IMission) => void;
    rocket: IRocketPopulated;
    updateRocket: (payload: IRocketPopulated) => void;
    logs: ILoggedTelemetryPacket[];
    updateLogs: (payload: IAprsTelemetryPacket) => void;
}

export const ActiveContext = createContext<IActiveMissionContext>({
    missionId: '',
    updateMissionId: (id: string) => null,
    rocketId: '',
    updateRocketId: (id: string) => null,
    dataConfigId: '',
    updateDataConfigId: (id: string) => null,
    activeMission: {} as IMission,
    updateMission: (payload: IMissionPopulated | IMission) => null,
    rocket: {} as IRocketPopulated,
    updateRocket: (payload: IRocketPopulated) => null,
    logs: [],
    updateLogs: (payload: IAprsTelemetryPacket) => null
});

function rocketReducer(state: IRocketPopulated, action: {type: string, payload: any}) {
    switch (action.type) {
        case 'SET_ROCKET': 
            return action.payload;
        default:
            throw Error(`Unknown action type: ${action.type}`);
    }
}

function missionReducer(state: IMissionPopulated | IMission, action: {type: string, payload: any}) {
    switch (action.type) {
        case 'SET_MISSION': 
            return action.payload;
        default:
            throw Error(`Unknown action type: ${action.type}`);
    }
}

function logsReducer(state: ILoggedTelemetryPacket[], action: {type: string, payload: IAprsTelemetryPacket}) {
    switch (action.type) {
        case 'addLog':
            const formatted = formatPacket(action.payload);
            const payload: ILoggedTelemetryPacket = {
                Parsed: action.payload.Parsed,
                Raw: action.payload.Raw,
                Log: formatted
            }
            return [...state, payload];
        default:
            throw Error(`Unknown action type: ${action.type}`);
    }
}

export const ActiveMissionProvider = ({ children }: PropsWithChildren<any>) => {
    const [rocket, rocketDispatch] = useReducer(rocketReducer, {} as IRocketPopulated);
    const [activeMission, activeMissionDispatch] = useReducer(missionReducer, {} as IMissionPopulated);
    const [logs, logsDispatch] = useReducer(logsReducer, [] as ILoggedTelemetryPacket[]);
    const [missionId, setMissionId] = useState<string>('');
    const [rocketId, setRocketId] = useState<string>('');
    const [dataConfigId, setDataConfigId] = useState<string>('');

    const updateDataConfigId = (id: string) => {
        setDataConfigId(id);
    }

    const updateMissionId = (id: string) => {
        setMissionId(id);
    }

    const updateRocketId = (id: string) => {
        setRocketId(id);
    }

    const updateLogs = (log: IAprsTelemetryPacket) => {
        logsDispatch({type: 'addLog', payload: log});
    }

    const updateRocket = (rocket: IRocketPopulated) => {
        rocketDispatch({type: 'SET_ROCKET', payload: rocket});
    }

    const updateMission = (mission: IMissionPopulated | IMission) => {
        activeMissionDispatch({type: 'SET_MISSION', payload: mission});
    }

    return(
        <ActiveContext.Provider 
            value={{
                dataConfigId,
                updateDataConfigId,
                missionId,
                updateMissionId,
                rocketId,
                updateRocketId,
                activeMission, 
                rocket, 
                logs, 
                updateRocket,
                updateMission,
                updateLogs
            }}
        >
            {children}
        </ActiveContext.Provider>
    );
};

export const useActiveMission = () => useContext<IActiveMissionContext>(ActiveContext);