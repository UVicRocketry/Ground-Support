import mongoose, { Document, Schema, Types } from "mongoose";
import { isValidLongitude, isValidLatitude } from "../library/CoordinateValidation";
import { DataConfigSchema } from "./DataConfigModel";

interface ICoordinates {
    Latitude: number;
    Longitude: number;
};

export interface IMission {
    Name: string;
    IsTest: boolean;
    Date: Date;
    Coordinates: ICoordinates;
    LaunchAltitude: number;
    DataConfig: [];
    Published: boolean;
};

export interface IMissionModel extends IMission, Document { };

const CoordinatesSchema: Schema = new Schema(
    {
        Latitude: {
            type: Number,
            required: true,
            validator: (lat: number) => {
                return isValidLatitude(lat);
            }
        },
        Longitude: {
            type: Number,
            required: true,
            validator: (long: number) => {
                return isValidLongitude(long);
            }
        }
    }
);

const MissionSchema: Schema = new Schema(
    {
        Name: {
            type: String,
            required: true
        },
        IsTest: {
            type: Boolean,
            required: true
        },
        LaunchAltitude: {
            type: Number,
            required: true
        },
        Date: {
            type: Date,
            required: true
        },
        Coordinates: CoordinatesSchema,
        DataConfig: [DataConfigSchema],
        Published: {
            type: Boolean
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IMission>('Mission', MissionSchema);