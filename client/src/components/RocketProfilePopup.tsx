import React, { useEffect, useState } from 'react';
import {
	Button,
	InputAdornment,
	TextField,
	FormControl,
	MenuItem,
	Stack,
	DialogTitle,
	Dialog,
	DialogActions,
	DialogContent,
	InputLabel,
	Select,
	Box,
	Chip,
	OutlinedInput
} from '@mui/material';
import { Add, FileUpload } from '@mui/icons-material';
import { IRocket } from '../utils/entities';
import axios from 'axios';

interface RocketProfileProps {
	rocketProfileId?: string;
	isOpen: boolean;
	onSave: () => void;
	onClose: () => void;
}

interface IRocketDetails {
	result: IRocket;
}

const RocketProfilePopup: React.FC<RocketProfileProps> = (props: RocketProfileProps) => {
	const [name, setName] = useState<string>();
	const [motor, setMotor] = useState<string>();
	const [mass, setMass] = useState<number>();
	const [motorType, setMotorType] = useState<string>('');
	const [rocketClass, setRocketClass] = useState<string>('');
	const [height, setHeight] = useState<number>();
	const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
	const [rocketData, setRocketData] = useState<IRocket>();
	// POST or PATCH data depending on if were creating a new rocket or editing a old one
	const save = async () => {
		const payload = {
			Height: height,
			Class: rocketClass,
			Motor: motor,
			MotorType: motorType,
			Name: name,
			Mass: mass
		};
		if (props.rocketProfileId) {
			await axios.patch(`http://127.0.0.1:9090/rocket/${props.rocketProfileId}`, payload);
		} else {
			await axios.post(`http://127.0.0.1:9090/rocket`, payload);
		}
	};

	useEffect(() => {
		async function getRocket() {
			console.log('about to query');
			//make an API call when component first mounts and setRocketData with response
			const response = await axios.get<IRocketDetails>(`http://127.0.0.1:9090/rocket/${props.rocketProfileId}`);
			console.log(response);
			const rocket = response.data.result;

			const data: IRocket = {
				Name: rocket.Name,
				Missions: rocket.Missions,
				Components: rocket.Components,
				Mass: rocket.Mass,
				Height: rocket.Height,
				Class: rocket.Class,
				MotorType: rocket.MotorType,
				Motor: rocket.Motor
			};
			console.log(data);
			setRocketData(data);
		}
		if (props.isOpen) {
			getRocket();
		}
	}, [props.isOpen]);

	const [editMode, setEditMode] = useState<boolean>(props.rocketProfileId !== '-1');

	useEffect(() => {
		setEditMode(props.rocketProfileId !== '');
		// Reset State
		setHeight(NaN);
		setMass(NaN);
		setRocketClass('');
		setMotor('');
		setName('');
		setMotorType('');
		async function getRocketDetails() {
			if (props.rocketProfileId) {
				const response = await axios.get<IRocketDetails>(
					`http://127.0.0.1:9090/rocket/${props.rocketProfileId}`
				);
				const data = response.data.result;
				setHeight(data.Height);
				setMass(data.Mass);
				setRocketClass(data.Class);
				setMotor(data.Motor);
				setName(data.Name);
				setMotorType(data.MotorType);
				return response.data;
			}
		}
		getRocketDetails();
	}, [props.rocketProfileId]);

	const handleChange = (e: any, setState: Function) => {
		if (!editMode) {
			setEditMode(true);
		}
		setState(e.target.value as string);
	};

	const saveProfile = () => {
		save();
		props.onSave();
	};

	return (
		<Dialog open={props.isOpen} fullWidth>
			<DialogTitle sx={{ typography: 'h4' }}>Rocket Profile</DialogTitle>
			<DialogContent>
				<FormControl fullWidth>
					<Stack sx={{ paddingTop: '5px' }} direction="column" spacing={3} alignItems="left">
						<Stack direction="row" spacing={3}>
							<TextField
								InputLabelProps={{ shrink: editMode }}
								type="String"
								value={name}
								onChange={(e) => handleChange(e, setName)}
								fullWidth
								size="small"
								id="profile-name"
								label="Profile Name"
								variant="outlined"
							/>
							<Button
								sx={{ minWidth: '80px' }}
								size="small"
								variant="contained"
								startIcon={<FileUpload />}
								component="label"
							>
								<input hidden accept="*" type="file" />
								SVG
							</Button>
						</Stack>
						<Stack direction="row" spacing={3}>
							<FormControl sx={{ width: '70%', display: 'inline-block' }} variant="filled">
								<InputLabel id="component-source-label">Components</InputLabel>
								<Select
									id="component-source"
									variant="outlined"
									multiple
									fullWidth
									// sx={{ width: '70%' }}
									value={selectedComponents}
									onChange={(e) => handleChange(e, setSelectedComponents)}
									renderValue={(selected: string[]) => (
										<Box
											sx={{
												display: 'flex',
												flexWrap: 'wrap',
												gap: 0.5,
												transform: 'translateY(20%)'
											}}
										>
											{selected.map((value: string) => (
												<Chip key={value} label={value} />
											))}
										</Box>
									)}
									labelId="component-source-label"
								>
									{rocketData?.Components.map((name) => (
										<MenuItem key={name} value={name}>
											{name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Button
								variant="contained"
								component="label"
								className={'button'}
								startIcon={<Add />}
								size="small"
								sx={{ width: '30%' }}
							>
								Components
							</Button>
						</Stack>
						<TextField
							sx={{ minWidth: '100%' }}
							id="mass"
							size="small"
							value={mass}
							onChange={(e) => handleChange(e, setMass)}
							label="Mass"
							type="Number"
							variant="outlined"
							InputLabelProps={{ shrink: editMode }}
							InputProps={{
								endAdornment: <InputAdornment position="start">kg</InputAdornment>
							}}
						/>
						<TextField
							sx={{ minWidth: '100%' }}
							id="height"
							size="small"
							type="Number"
							value={height}
							onChange={(e) => handleChange(e, setHeight)}
							label="Height"
							variant="outlined"
							InputLabelProps={{ shrink: editMode }}
							InputProps={{
								endAdornment: <InputAdornment position="start">m</InputAdornment>
							}}
						/>
						<TextField
							size="small"
							sx={{ minWidth: '100%' }}
							value={rocketClass}
							defaultValue={rocketClass}
							onChange={(e) => handleChange(e, setRocketClass)}
							select
							InputLabelProps={{ shrink: editMode }}
							label="Class"
						>
							<MenuItem key="10K" value="10K">
								10K
							</MenuItem>
							<MenuItem key="30K" value="30K">
								30K
							</MenuItem>
							<MenuItem key="60K" value="60K">
								60K
							</MenuItem>
							<MenuItem key="100K" value="100K">
								100K+
							</MenuItem>
						</TextField>
						<Stack direction="row" spacing={2}>
							<TextField
								size="small"
								select
								label="Motor Type"
								sx={{ minWidth: '40%' }}
								InputLabelProps={{ shrink: editMode }}
								value={motorType}
								defaultValue={motorType}
								onChange={(e) => handleChange(e, setMotorType)}
							>
								<MenuItem key="Solid" value="Solid">
									Solid
								</MenuItem>
								<MenuItem key="Liquid" value="Liquid">
									Liquid
								</MenuItem>
								<MenuItem key="Hybrid" value="Hybrid">
									Hybrid
								</MenuItem>
							</TextField>
							<TextField
								size="small"
								sx={{ minWidth: '58%' }}
								id="motor-name"
								value={motor}
								onChange={(e) => handleChange(e, setMotor)}
								label="Motor"
								InputLabelProps={{ shrink: editMode }}
								disabled={motorType !== 'Solid'}
								variant="outlined"
							/>
						</Stack>
					</Stack>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button onClick={saveProfile}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RocketProfilePopup;
