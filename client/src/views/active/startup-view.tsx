import { useCallback, useEffect, useState } from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// Components UI
import Header, { Breadcrumb } from '../../components/Header';
import TelemetryLog from '../../components/logging/TelemetryLog';
import { 
	Grid, 
	Paper, 
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	OutlinedInput,
	Box,
	Chip,
	Typography,
	TextField,
	Button
} from '@mui/material';

// Utils
import { IComponent, IDataConfig, IModule } from '../../utils/entities';
import { useActiveMission } from '../../utils/ActiveMissionContext';
import api from '../../services/api';
import ModuleStatus from '../../components/ModuleNew';
import { useSocketContext } from '../../utils/socket-context';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import SensorsIcon from '@mui/icons-material/Sensors';
import { IAprsTelemetryPacket } from '../../utils/TelemetryTypes';
import Graph from '../../components/RealTimeGraph';
import { CoordinateGrid } from '../../components/CartesianGrid';
import { ViewKeys } from '../../utils/viewProviderContext';

export default function StartUpView() {
	const [component, setComponent] = useState<IComponent>();
	const [connected, setConnected] = useState<boolean>(false);
	const [packetNumber, setPacketNumber] = useState<number>(1);
	const [currentPacket, setCurrentPacket] = useState<IAprsTelemetryPacket>({
		Raw: [''],
		Parsed: {
			timeStampLocal: '0-0-0',
			timeStampUnix: '0.0',
			latitude: 0,
			longitude: 0,
			altitude: 0,
			lock: false,
		}
	});

	const sc = useSocketContext();
	const activeContext = useActiveMission();

	const breadCrumbs: Breadcrumb[] = [
		{ name: "Ground Support", viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: false },
		{ name: activeContext.rocket.Name, viewKey: ViewKeys.ROCKET_DETAILS_KEY, active: false },
		{ name: activeContext.activeMission.Name || "New Mission", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true },
		{ name: "Start Up", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true }
	];

	const [dataConfig, setDataConfig] = useState<IDataConfig>();
	const getDataConfig = useCallback(async () => {
		try {
			if (component?.DataConfigId === undefined) return console.log('No Data Config Id');
			const response = await api.getDataConfig(component?.DataConfigId);
			const data = response.data as IDataConfig;
			setDataConfig(data);
		} catch (error) {
			console.log(error);
		}
	}, [component?.DataConfigId]);


	useEffect(() => {
		console.log('active rocket:', activeContext.rocket);
		console.log('active mission:', activeContext.activeMission);
		getDataConfig();
	}, []);

	const savePacketToDatabase = useCallback(async (packet: IAprsTelemetryPacket) => {
		// TODO: function that maps incoming data to fields from dataconfig
	}, [currentPacket]);

	useEffect(() => {
		if (sc.aprsPacket.Data === undefined) return 
		activeContext.updateLogs(sc.aprsPacket.Data as IAprsTelemetryPacket);
		setCurrentPacket(sc.aprsPacket.Data as IAprsTelemetryPacket);
	}, [sc.aprsPacket.Data, activeContext]);

	useEffect(() => {
		setPacketNumber(packetNumber + 1);
		try {
			savePacketToDatabase(currentPacket)
		} catch (error) { }

	}, [currentPacket]);

	return (
		<>
			<Grid container direction="column" paddingX="2rem" paddingY="2rem" gap={3}>
				{/* Page Header */}
				<Grid item>
					<Header icon='ROCKET_MONITORING' breadCrumbs={breadCrumbs} />
				</Grid>

				{/* Parameters Controllers */}
				<Grid item>
					<Paper elevation={2} sx={{ padding: 2 }}>
                        <Stack direction="row" spacing={5} justifyContent={'space-between'} alignItems={'center'}>
							<Stack direction="row" alignItems={'center'} spacing={2}>
                                <RocketLaunchIcon sx={{ color: 'uvr.yellow' }} /> 
                                <Typography align='left' variant='h5'>
                                    {activeContext.rocket.Name || 'Mission Not found'}
                                </Typography>
                            </Stack>
							<Stack direction="row" alignItems={'center'} spacing={2}>
								<TextField 
										label='Mission' 
										size='small'
										value={activeContext.activeMission.Name} 
										defaultValue={activeContext.activeMission.Name}                                 
										InputLabelProps={{ shrink: true}}
									/>
								<FormControl sx={{ minWidth: 200 }}>
									<InputLabel id="telemetry-source-select-title">Component Details</InputLabel>
									<Select
										size="small"
										labelId="telemetry-source-select-label"
										id="telemetry-source-select"
										value={component?.Name || ''}
										onChange={(e, key: any) => setComponent(activeContext.rocket.Components[key.key.slice(2)])}
										input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
										renderValue={(selected: string) => (
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													gap: 0.5,
													transform: 'translateY(20%)'
												}}
											>
												<Chip label={selected} />
											</Box>
										)}
										sx={{
											'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
												border: 'none !important'
											}
										}}
									>
										{activeContext.rocket.Components.map((component, index) => (
											<MenuItem key={index} value={component.Name}>
												{component.Name}
											</MenuItem>
										))}							
									</Select>
								</FormControl>
								<Button
									startIcon={connected ? <SensorsIcon /> : <SensorsOffIcon />}
									variant='contained'
									onClick={() => setConnected(!connected)}
								>
									Connect
								</Button>
							</Stack>
                        </Stack>
                    </Paper>
				</Grid>
				<Grid container direction={'row'} gap={3}>
					<Grid item width={component?.Name === 'Big Red Bee' ? '50%' : '100%'}>
						<TelemetryLog
							packet={currentPacket}
							telemetryConnected={connected}
							width='100%' 
							maxRows={15}
						/>
					</Grid>
					{component?.Name === 'Big Red Bee' &&
						<Grid item direction={'column'} width={'46%'} gap={3} height={"60vh"}>
							{/* <Grid> */}
								<CoordinateGrid 
									packet={currentPacket}
								/>
							{/* </Grid>
							<Grid> */}
								<Graph 
									dataKeys={['Altitude']}
									packet={currentPacket}
									staticData={[]}
									realTime
								/>
							{/* </Grid> */}
						</Grid>
					}
					
				</Grid>
			</Grid>
		</>
	);
}
