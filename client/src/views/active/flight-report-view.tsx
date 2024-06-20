import { useState, useEffect } from 'react';
import { IDataConfig, IMission, IMissionPopulated } from '../../utils/entities';

import { Accordion, AccordionDetails, AccordionSummary, Grid, Stack, Typography, Paper, Button, useTheme } from '@mui/material';
import Header, { Breadcrumb } from '../../components/Header';
import ModuleSummary from '../../components/ModuleSummary';
import { useActiveMission } from '../../utils/ActiveMissionContext';
import api from '../../services/api';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DataUpload from '../../components/DataUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { ViewKeys } from '../../utils/viewProviderContext';

export default function FlightReportView() {
    const context = useActiveMission()
    const [missionData, setMissionData] = useState<IMission>();
    const [dataConfigs, setDataConfigs] = useState<IDataConfig[]>([]);
    const [isDataUploadOpen, setIsDataUploadOpen] = useState<boolean>(false);
    const breadCrumbs: Breadcrumb[] = [
        { name: "Ground Support", viewKey: ViewKeys.ROCKET_SELECT_KEY, active: false },
        { name: context.rocket.Name, viewKey: ViewKeys.ROCKET_DETAILS_KEY, active: false },
		{ name: missionData?.Name || "New Mission", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true },
		{ name: "Flight Report", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true }
	];

    useEffect(()=> {
        // reset state 
        setMissionData(undefined);
        setDataConfigs([]);

        const getDataConfigs = async () => {
            const mid = context.activeMission._id || '';
            const response = await api.getMission(mid)
            const missionData = response.data as IMissionPopulated
            setMissionData(context.activeMission); 

            if (missionData.Components) { 
                missionData.Components.map(async(component) => {
                    setDataConfigs((prev) => [...prev, component.DataConfigId]);
                });
            }
        };
        getDataConfigs();
    }, [missionData]);


    return (
        <Grid 
			container 
			direction="column" 
			paddingX="2rem" 
			paddingY="2rem" 
			gap={3}
		>
			<Grid container>
				<Header icon='ROCKET_MONITORING' breadCrumbs={breadCrumbs} />
			</Grid>
            <Grid item>
                <Paper elevation={2} sx={{ padding: 2 }}>
                    <Stack direction="row" spacing={5} justifyContent={'space-between'} alignItems={'center'}>
                        <Stack direction="row" alignItems={'center'} spacing={2}>
                            <AssessmentIcon sx={{ color: 'uvr.darkBlue' }} />
                            <Typography align='left' variant='h5'>
                                {context.activeMission.Name + ' Flight Report'|| 'Mission Not found'}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems={'center'} spacing={2}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<UploadFileIcon />}
                                onClick={() => setIsDataUploadOpen(true)}
                            >
                                Data
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<DownloadForOfflineIcon />}
                                onClick={() => {}}
                            >
                                Report
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
            <Grid container style={{ height: '60vh', overflowY: 'scroll' }}>
                {dataConfigs.map((dataConfig: IDataConfig) => {
                    return dataConfig.Modules.map((module, idx) => {
                        return <ModuleSummary Index={idx} Module={module} />;
                    });
                })}
            </Grid>
            <DataUpload isOpen={isDataUploadOpen} onClose={() => setIsDataUploadOpen(false)} />
        </Grid>
    );
}