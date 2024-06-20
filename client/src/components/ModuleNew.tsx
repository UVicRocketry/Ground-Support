import { Card, CardContent, CardHeader, Divider, Chip } from "@mui/material";
import { IField, IModule, IFieldGroup } from "../utils/entities"
import { telemetryStatus, StatusTypes, TelemetryStatus, moduleStatus } from "../utils/statusTypes";
import { Reducer, useEffect, useReducer, useState } from "react";
import _ from "lodash";

interface ModuleProps {
    module: IModule;
    statusOnly: boolean
}

const statusReducer = (
    state: 
        StatusTypes.InActive | 
        StatusTypes.Failed | 
        StatusTypes.Active | 
        StatusTypes.Default, 
    action: { 
        type: string, 
        payload: string 
    }
) => {
    switch (action.type) {
        case StatusTypes.InActive:
            return StatusTypes.InActive;
        case StatusTypes.Active:
            return StatusTypes.Active;
        case StatusTypes.Failed:
            return StatusTypes.Failed;
        default:
            return StatusTypes.InActive;
    }
}

/**
 * @param module IModule object
 * @param dataPoints incoming data points for the module in the order of the fields
 * 
 * @returns (string | boolean)[][]: An array of array where each of the inner arrays contains the name of the field and its status & overall status of the module
 * 
 * @description Generates the status of the fields inside the modules based on the acceptable range of values and the incoming dataPoints
 */
const processStatus = (module: any, dataPoints: number[]) => {
    const gt = (objValue: number, othValue: number): boolean => objValue > othValue;
    const lt = (objValue: number, othValue: number): boolean => objValue < othValue;
    
    // If there is no data, the module is inactive
    const statusInactive = dataPoints.every((point) => point === 0);

    //TODO: Telemetry Lock detection
 
    const dataInRange: (StatusTypes.InActive | StatusTypes.TelemetryLocked | StatusTypes.Active | StatusTypes.Failed | boolean)[][] = module.FieldGroups.map((fg: IFieldGroup) => {
        const statuses = fg.Fields.map((f: IField) => {
            return [f.Name, dataPoints.every((point) => gt(point, f.Range[1]) || lt(point, f.Range[0]))];
        });
        return statuses;
    });

    try {
        if (statusInactive) {
            return {
                status: StatusTypes.InActive            
            }
        }
        const isActive = dataInRange.every((fieldStatus) => !fieldStatus[1])
        let payload = {
            status: isActive ? StatusTypes.Active : StatusTypes.Failed,
            fieldStatuses: dataInRange
        };

        return payload;
    } catch (error) {
        console.log(error);
        return {
            status: StatusTypes.Default
        }
    }
}

const ModuleStatus: React.FC<ModuleProps> = (props: ModuleProps) => {
    const { module, statusOnly } = props;

    const data = [2.5, 2.5, 2.5];


        const [status, statusDispatch] = useReducer<
        Reducer<
            StatusTypes.InActive | 
            StatusTypes.Active | 
            StatusTypes.Default | 
            StatusTypes.Failed, 
            any>
        >(statusReducer, StatusTypes.InActive);
    useEffect(() => {
        const st = processStatus(module, data);
        statusDispatch({ type: st.status });
    }, []);

    return (
        <Card sx={{ minWidth: 150 }}>
            <CardHeader 
                title={module?.Name || "No Data"}
                titleTypographyProps={{ variant: 'h5' }}
                sx={{ padding: 2, textAlign: 'center' }} 
            />
            <CardContent sx={{ paddingBlockStart: 0, paddingBlockEnd: 0, textAlign: 'center' }}>
                {!statusOnly &&<Divider variant="fullWidth" sx={{ mb: 2 }} />}
                {!statusOnly && <Divider variant="fullWidth" sx={{ mb: 2 }} />}
                <Chip 
                    sx={{ backgroundColor: moduleStatus[status].color }}
                    label={ moduleStatus[status].label }
                />
            </CardContent>
        </Card>
    );

}

export default ModuleStatus;
