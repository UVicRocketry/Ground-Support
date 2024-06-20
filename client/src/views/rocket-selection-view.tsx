import { useState, useEffect } from 'react';
import { Grid, Chip, Stack } from '@mui/material';
import Header, { Breadcrumb } from '../components/Header';
import addRocket from '../static/images/AddRocket.svg';
import RocketImage from '../static/images/Skookum1.svg';
import { ViewKeys, useViewProvider } from '../utils/viewProviderContext';

import '../styles/rocketSelection.css';
import RocketProfilePopup from '../components/RocketProfilePopup';
import api from '../services/api';
import { IRocketPopulated } from '../utils/entities';
import { useActiveMission } from '../utils/ActiveMissionContext';

interface Rocket {
	id: string;
	name: string;
	image?: string;
	active: boolean;
}



export default function RocketSelectionView() {
	const viewProviderContext = useViewProvider();
	const activeMissionContext = useActiveMission();

	const colors: string[] = [
		'rgba(255, 197, 87, 1)',
		'rgba(214, 91, 79, 1)',
		'rgba(0, 94, 184, 1)',
		'rgba(69, 136, 201, 1)'
	];

	const breadCrumbs: Breadcrumb[] = [
		{ name: 'Ground Support', viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: false },
		{ name: 'Rocket Selection', viewKey: ViewKeys.ROCKET_SELECT_KEY, active: true }
	];

	const [isOpen, setIsOpen] = useState(false);
	const [rocketData, setRocketData] = useState<Rocket[]>([]);
	const [rocketProfileId, setRocketProfileId] = useState<string>('');
	useEffect(() => {
		async function getRocketData() {
			const response = await api.getRockets();
			const data = response.data as IRocketPopulated[];
			const rockets: Rocket[] = data.map((rocket: any) => {
				return {
					id: rocket._id,
					image: 'Xenia2.svg',
					name: rocket.Name,
					active: true
				} as Rocket;
			});
			setRocketData(rockets);
		}
		getRocketData();
	}, []);

	const addNewRocket = () => {
		setRocketProfileId('');
		setIsOpen(true);
	};

	const setRocket = (data: Rocket) => {
		setRocketProfileId(data.id);
		// console.log(`Parent:${rocketProfileId}`)
		setIsOpen(true);
	};

	const getRocketImageURL = (data: Rocket) => {
		return new URL(`../static/images/Xenia2.svg`, import.meta.url).href;
	}

	const rockets = rocketData.map((data: Rocket) => {
		const rocketImageURL = getRocketImageURL(data);
		return (
			<div key={data.id.toString()}>
				<Stack direction="column" spacing={1} onClick={data.active ? () => setRocket(data) : () => {}}>
					<img src={RocketImage} alt="Rocket" width={40} />
					<Chip label={data.name} color={data.active ? 'primary' : 'default'} sx={{ fontWeight: 'bold' }} />
				</Stack>
			</div>
		);
	});

	return (
		<div style={{ width: '100vw', height: '99vh' }}>
			<Grid
				container
				direction="column"
				paddingX="2rem"
				paddingY="2rem"
				gap={3}
				sx={{ height: '100%', width: '100%' }}
			>
				{/* Page Header */}
				<Grid item justifyContent={'flex-start'}>
					<Header icon='ROCKET_MONITORING' breadCrumbs={breadCrumbs} />
				</Grid>

				{/* Rocket Selection */}
				<Grid container justifyContent="center" alignItems="center" style={{ height: '80%' }}>
					<Stack direction="row" justifyContent="center" spacing={8} alignItems="flex-end">
						{rockets}
						<Stack direction="column" spacing={1} onClick={addNewRocket}>
							<img src={addRocket} alt="Add Rocket" width={40}></img>
							<Chip label="New Rocket" color="primary" sx={{ fontWeight: 'bold' }} />
						</Stack>
					</Stack>
				</Grid>
			</Grid>
			<div>
				{colors.map((color) => {
					return (
						<div
							key={color}
							style={{
								backgroundColor: color,
								width: '25%',
								height: '1vh',
								float: 'left'
							}}
						/>
					);
				})}
			</div>
			<RocketProfilePopup
				rocketProfileId={rocketProfileId}
				isOpen={isOpen}
				onSave={() => {
					viewProviderContext.updateViewKey(ViewKeys.ROCKET_DETAILS_KEY);
					setIsOpen(false);
				}}
				onClose={() => setIsOpen(false)}
			/>
		<RocketProfilePopup
			rocketProfileId={rocketProfileId}
			isOpen={isOpen}
			onSave={() => { 
				viewProviderContext.updateViewKey(ViewKeys.ROCKET_DETAILS_KEY);
				activeMissionContext.updateRocketId(rocketProfileId);
				setIsOpen(false);
			}}
			onClose={() => setIsOpen(false)}
		/>
		</div>
	);
}
