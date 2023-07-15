import mongoose, { Document, Schema, Types } from "mongoose";
import { DataConfigSchema } from "./DataConfigModel";

enum TelemetrySource {
    lora = "LORA",
    aprs = "APRS"
};

export interface IComponent {
    Name: string;
    TelemetrySource: TelemetrySource;
    Details: string;
    DataConfig: typeof DataConfigSchema;
};

export interface IComponentModel extends IComponent, Document { 
    _id: string;
    Name: string;
    Details: string;
    TelemetrySource: TelemetrySource;
    createdAt: string;
    updatedAt: string;
};

const ComponentModel: Schema = new Schema(
    {
        Name: {
            type: String,
            required: true
        },
        Details: {
            type: String,
            required: true
        },
        TelemetrySource: {
            type: String,
            enum: ['LORA', 'APRS']
        },
        DataConfigId: {
            type: Types.ObjectId, ref: 'DataConfig'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<IComponent>('Component', ComponentModel);