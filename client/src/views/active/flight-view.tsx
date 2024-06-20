import React, {  useState, useEffect } from 'react';
import Header, { Breadcrumb } from "../../components/Header";
import { Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useActiveMission } from '../../utils/ActiveMissionContext';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { IDataConfig } from '../../utils/entities';
import api from '../../services/api';
import ModuleStatus from '../../components/ModuleNew';
import { ViewKeys } from '../../utils/viewProviderContext';


export default function FlightView() {
	
	const context = useActiveMission();
	const breadCrumbs: Breadcrumb[] = [
		{ name: "Ground Support", viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: false },
		{ name: context.rocket.Name, viewKey: ViewKeys.ROCKET_DETAILS_KEY, active: false },
		{ name: context.activeMission.Name || "New Mission", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true },
		{ name: "Flight", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true }
	];


	const [dataConfigs, setDataConfigs] = useState<IDataConfig[]>([]);

	const getDataConfigs = async () => {
		if (context.rocket.Components) {
			context.rocket.Components.map(async(component) => {
				if (!component.DataConfigId) return;
				const response = await api.getDataConfig(component.DataConfigId);
				const data = response.data as IDataConfig;
				setDataConfigs((prev) => [...prev, data]);
			});
		}
	};

	useEffect(() => {
		getDataConfigs();
	}, []);

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
							<AirplaneTicketIcon sx={{ color: 'uvr.red' }} />
                            <Typography align='left' variant='h5'>
                                {context.activeMission.Name + ' Flight Report'|| 'Mission Not found'}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems={'center'} spacing={2}>
							<Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<ViewModuleIcon />}
                                onClick={() => {}}
                            >
                                Configure Modules
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
			<Grid 
				item 
				gap={3}
				direction="row"
				sx={{ 
					display: "flex"
				}}
				justifyContent="space-between"
				alignItems="stretch"
			>
				{context.rocket.Components?.map((component) => {
					return (
						<Grid container direction="column" gap={2}>
							<Grid item>
								<Typography variant='h5'>
									{component.Name}
								</Typography>
							</Grid>
							{component.DataConfigId && dataConfigs.map((dc) => dc.Modules.map((module) => {
								return (
									<Grid item>
										<ModuleStatus module={module} statusOnly />
									</Grid>
								)})
							)}
							{/* {!component.DataConfigId && (
									<TelemetryLog 
										telemetryConnected
										value={context.logs}
										width='100%' 
										maxRows={15}
									/>
							)} */}
						</Grid>	
					);
				})}
			</Grid>
			
		</Grid>
	);
}
