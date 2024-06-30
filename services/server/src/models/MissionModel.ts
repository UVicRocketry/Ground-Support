import mongoose, { Document, Schema, Types } from "mongoose";
import { isValidLongitude, isValidLatitude } from "../library/CoordinateValidation";
import { ITelemetryPacket, TelemetryPacketSchema } from "./TelemetryPacketModel";

interface ICoordinates {
    Latitude: number;
    Longitude: number;
};

export interface IMission {
    Name: string;
    IsActive: boolean;
    IsTest: boolean;
    Date: Date;
    Coordinates: ICoordinates;
    LaunchAltitude: number;
    Components: [Types.ObjectId];
    Published: boolean;
    Data?: ITelemetryPacket[];
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

export const MissionSchema: Schema = new Schema(
    {
        Name: {
            type: String,
            required: true
        },
        IsTest: {
            type: Boolean,
            required: true
        },
        IsActive: {
            type: Boolean,
            required: true,
            default: false
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
        Components: [{
            type: Types.ObjectId,
            ref: 'Component'
        }],
        Published: {
            type: Boolean,
            default: false,
            required: true
        },
        Data: {
            type: [TelemetryPacketSchema],
            required: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

MissionSchema.pre('findOne', function (next) { 
    this.populate({
        path: "Components",
        // model: "Component",
        populate: {
            path: "DataConfigId",
            model: "DataConfig"
        },
        options: { strictPopulate: false }
    });
    next();
});

export default mongoose.model<IMission>('Mission', MissionSchema);