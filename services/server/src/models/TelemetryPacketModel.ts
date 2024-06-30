import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITelemetryPacket {
    Data: {
        Altitude: number;
        Latitude?: number;
        Longitude?: number;
        CallSign?: string;
    };
    Id: number;
};

export const TelemetryPacketSchema: Schema = new Schema(
    {
        Data: {
            Altitude: Number,
            Latitude: Number,
            Longitude: Number,
            CallSign: String
        },
        PacketId: Number
    },
    {
        versionKey: false,
        timestamps: false
    }
);