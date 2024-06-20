export const CONTROL_PACKET_TYPE = "CONTROLS";
export const INSTRUMENTATION_PACKET_TYPE = "INSTRUMENTATION";
export const INFO_PACKET_TYPE = "INFO";

export enum PacketType {
    CONTROLS = CONTROL_PACKET_TYPE,
    INSTRUMENTATION = INSTRUMENTATION_PACKET_TYPE,
    INFO = INFO_PACKET_TYPE
}

interface IBasePacket {
    identifier: PacketType;
}

/*------------ Controls -------------*/

enum ControlsValveTypes {
    MEV = "MEV",
    PRIME = "PRIME",
    N2OFlow = "N2OF",
    N2OVent = "N2OV",
    N2Flow = "N2F",
    RTV = "RTV",
    NCV = "NCV",
    ERV = "ERV"
}

enum ControlsActionTypes {
    OPEN = "OPEN",
    CLOSE = "CLOSE"
}

enum ControlsCommandTypes {
    STATUS = "STATUS",
    CONTROL = "CTRL",
    ABORT = "ABORT",
    RESET = "RESET",
    SET = "SET"
}

export interface IControlsPacket extends IBasePacket {
    valve?: ControlsValveTypes;
    action?: ControlsActionTypes;
    command: ControlsCommandTypes;
}

/*------------ Instrumentation -------------*/

enum InstrumentationCommandTypes {
    STATUS = "STATUS",
    RESET_SENSOR = "RESET_SENSOR",
    STREAM_SENSORS = "STREAM_SENSORS",
    SAMPLE_SENSORS = "SAMPLE_SENSORS"
}

export interface IInstrumentationPacket extends IBasePacket {
    command: InstrumentationCommandTypes
}



export { 
    ControlsValveTypes, 
    ControlsActionTypes, 
    ControlsCommandTypes
};

/*------------ Feed System types -------------*/

import { Node, Edge }  from 'reactflow';

/*------------ P&ID Types -------------*/

export enum PAndIDNodeTypes {
    VALVE = "Valve",
    INSTRUMENTATION = "Instrumentation",
    TANK = "Tank"
}

export enum PAndIDInstrumentationTypes {
    TEMP_CONTROLLER = "TC",
    PRESSURE_CONTROLLER = "PC",
    LEVEL_CONTROLLER = "LC",
    TEMP_TRANSMITTER = "TT",
    PRESSURE_TRANSMITTER = "PT",
    LEVEL_TRANSMITTER = "LT",
    TEMP_INDICATOR = "TI",
    PRESSURE_INDICATOR = "PI",
    LEVEL_INDICATOR = "LI"
}

export declare type TankTypes = "GasBottleTank" 
    | "VerticalVesselTank" 
    | "TankTank" 
    | "";

export declare type ValveTypes = "BallValve" 
    | "CheckValve" 
    | "HandOperatedValve" 
    | "MotorValve" 
    | "PneumaticValve" 
    | "SolenoidValve" 
    | "SpringValve" 
    | "RegulatorValve" 
    | "PressureRegulatorValve" 
    | "NeedleValve" 
    | "";

export declare type InstrumentationTypes = PAndIDInstrumentationTypes | "";



export interface IPAndIDNode extends Node {
    data: {
        label: ControlsValveTypes | string;
        nodeType?: PAndIDNodeTypes;
        controllable?: boolean;
        tankType?: TankTypes;
        instrumentationType?: InstrumentationTypes;
        valveType?: ValveTypes
    };
}

export interface IFeedSystem {
    nodes: IPAndIDNode[];
    edges: Edge[];
}