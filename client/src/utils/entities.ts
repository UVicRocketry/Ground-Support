enum TelemetrySource {
    lora = "LORA",
    aprs = "APRS"
}

export interface IField {
    Name: string,
    Range: number[],
    Units: string,
    TelemetryId: number
}

export interface IModule {
    Name: string;
    FieldGroups: IField[];
}

export interface IDataConfig {
    Modules: IModule[];
}

interface ICoordinates {
    Latitude: number;
    Longitude: number;
}

export interface IMission {
    Name: string;
    IsTest: boolean
    Date: Date;
    Coordinates: ICoordinates;
    LaunchAltitude: Number;
    Components: string[];
    Published: boolean;
}

export interface IMIssionPopulation {
    Name: string;
    IsTest: boolean
    Date: Date;
    Coordinates: ICoordinates;
    LaunchAltitude: Number;
    Components: IComponent[];
    Published: boolean;
}

enum MotorType {
    solid = "Solid",
    liquid = "Liquid",
    hybrid = "Hybrid"
};

export interface IRocket {
    Name: string;
    Missions: string[];
    Components: string[];
    Mass: number;
    Height: number;
    Class: string;
    MotorType: MotorType;
    Motor: string;
}

export interface IRocketPopulated {
    Name: string;
    Missions: IMission[];
    Components: IComponent[];
    Mass: number;
    Height: number;
    Class: string;
    MotorType: MotorType;
    Motor: string;
}

export interface IComponent {
    Name: string;
    TelemetrySource: TelemetrySource;
    Details: string,
    DataConfig: IDataConfig
}
export interface IFieldGroup {
    Name: String;
    Fields: IField[];
}

interface IDataPoint {
    Value: number,
    timeStamp: Date
}

export interface IFieldData {
    Name: string;
    Range: number[];
    Units: string;
    ParentModuleName: string;
    ParentFieldGroupName: string;
    TelemetryId: Buffer;
    Data: IDataPoint[];
}