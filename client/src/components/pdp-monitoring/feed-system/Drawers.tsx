import { 
	Box,
	Button,
	Chip, 
	Divider, 
	Drawer, 
	FormControl, 
	Grid, 
	IconButton, 
	InputLabel, 
	Link,
	MenuItem, 
	Select, 
	SelectChangeEvent, 
	Stack, 
	TextField, 
	ToggleButton, 
	Tooltip, 
	Typography, 
	styled, 
	useTheme
} from '@mui/material';
import React, { useState, useEffect } from 'react';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

// Symbol mappings
import { ValveTypeKeys, ValveTypeStrings, ValveTypeSVGs } from '../../../static/valves/ValveTypes';
import { TankTypesSVGs, TankTypeKeys, TankTypeStrings } from '../../../static/tanks/TankTypes';

// Monitoring System Types
import { 
	IPAndIDNode, 
	InstrumentationTypes, 
	PAndIDInstrumentationTypes, 
	PAndIDNodeTypes, 
	TankTypes, 
	ValveTypes 
} from '../../../utils/monitoring-system/monitoring-types';

// images
import InstrumentationLegend from '../../../static/InstrumentationLegend.svg';
import InstrumentationSymbol from '../../../static/instrumentation/InstrumentationSymbol.svg';

const DRAWER_WIDTH = 310;

const BaseDrawer = styled(Drawer)({
    flexShrink: 0,
    position: "relative",
    '& .MuiDrawer-paper': {
		padding: 2,
        maxHeight: '100%',
        width: DRAWER_WIDTH,
        height: `fit-content`,
        position: "absolute", //imp
        borderRadius: '10px',
        boxSizing: 'border-box',
        backgroundColor: '#33373E',
    },
}); 

interface PAndIDBuilderProps {
	openDrawer: boolean;
	setNodeBuilderDrawer: () => void;
	onAdd: (node: IPAndIDNode) => void;
	nodeCount: number;
}

const PAndIDBuilderDrawer: React.FC<PAndIDBuilderProps> = (props: PAndIDBuilderProps) => {
	const { 
		openDrawer, 
		setNodeBuilderDrawer, 
		onAdd, 
		nodeCount 
	} = props;

	const theme = useTheme();
	const id: string = (nodeCount + 1).toString();
	useEffect(() => {
		console.log(id);
	}, []);
	// Node builder form state
	const [nodeType, setNodeType] = useState<PAndIDNodeTypes>(PAndIDNodeTypes.VALVE);

	const defaultNode: IPAndIDNode = {
		id: id,
		type: nodeType,
		position: { x: 0, y: 0 },
		data: {
			label: '',
			controllable: false
		},
	};

	// const [node, setNode] = useState<IPAndIDNode>(defaultNode);

	// Node Handler
	// const updateNode = () => {
	// 	setNode({ 
	// 		id: id,
	// 		type: nodeType,
	// 		position: { x: 0, y: 0 },
	// 		data: { 
	// 			controllable: controllable,
	// 			tankType: tankType,
	// 			valveType: valveType,
	// 			instrumentationType: instrumentationType,
	// 			label: nodeType == PAndIDNodeTypes.VALVE ? valveLabel : tankLabel
	// 		} 
	// 	});
	// };

	const resetNode = () => {
		setNodeType(PAndIDNodeTypes.VALVE);
	};


	interface ValveFormProps {
		onAdd: (node: IPAndIDNode) => void;
		onClose: () => void;
		id: string;
	}

	const ValveFormContent = (props: ValveFormProps) => {
		const { onAdd, onClose, id } = props;

		useEffect(() => {
			console.log(id);
		}, []);

		const [controllable, setControllable] = useState<boolean>(false);
		const [valveType, setValveType] = useState<ValveTypes>('');
		const [valveLabel, setValveLabel] = useState<string>('');

		const [valveNode , setValveNode] = useState<IPAndIDNode>(defaultNode);
		
		const resetState = () => {
			setValveLabel('');
			setValveType('');
			setControllable(false);
		};

		return (
			<Stack gap={2}>
				<Stack direction="row" spacing={2}>
					<FormControl
						fullWidth
						size='small'
						required
					>
						<InputLabel id="valve-type-select-label">Valve Type</InputLabel>
						<Select
							labelId="valve-type-select-label"
							id="valve-type-select"
							value={valveType}
							onChange={(event: SelectChangeEvent) => {
								setValveType(event.target.value as ValveTypes);
							}}
							label="Valve Type"
						>
							{ValveTypeStrings.map((key: string, index: number) => (
								<MenuItem key={key} value={ValveTypeKeys[index]}>
									{key}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Tooltip title={'Controllable'} placement='top'>
						<ToggleButton
							value="check"
							selected={controllable}
							onChange={() => {
								setControllable(!controllable);
							}}
							size='small'
							>
								<CheckIcon />
						</ToggleButton>
					</Tooltip>
				</Stack>
				<TextField
					key={'valve-label'}
					id="valve-label"
					label="Valve Label"
					variant="outlined"
					size='small'
					value={valveLabel} 
					required
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setValveLabel(event.target.value);
					}}
					fullWidth
				/>
				<img
					src={ValveTypeSVGs[valveType]}
					alt={valveType as string}
					width={'100%'}
				/>
				<Button 
						variant="contained" 
						onClick={() => {
							onAdd({ 
								id: id,
								type: nodeType,
								position: { x: 0, y: 0 },
								data: { 
									controllable: controllable,
									valveType: valveType,
									label: valveLabel
								} 
							});
							resetState();
							onClose();
						}} 
						fullWidth
						disabled={valveLabel.length === 0}
					>
					Add
				</Button>
			</Stack>
		);
	};

	interface TankFormProps {
		onAdd: (node: IPAndIDNode) => void;
		onClose: () => void;
		id: string;
	}

	const TankFormContent = (props: TankFormProps) => {
		const { onAdd, id, onClose } = props;

		const [tankLabel, setTankLabel] = useState<string>('');
		const [tankType, setTankType] = useState<TankTypes>('');		

		const resetState = () => {
			setTankLabel('');
			setTankType('');
		};

		return(
			<Stack gap={2}>
				<TextField
					key={"tank-label"}
					id="tank-label"
					label="Tank Label"
					variant="outlined"
					size='small'
					value={tankLabel} 
					required
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setTankLabel(event.target.value);
					}}
					fullWidth
				/>
				<FormControl
						fullWidth
						size='small'
					>
						<InputLabel id="tank-type-select-label">Tank Type</InputLabel>
						<Select
							labelId="tank-type-select-label"
							id="tank-type-select"
							value={tankType as string}
							onChange={(event: SelectChangeEvent) => {
								setTankType(event.target.value as TankTypes);
							}}
							label="Valve Type"
							required
						>
							{TankTypeStrings.map((key: string, index: number) => (
								<MenuItem key={key} value={TankTypeKeys[index]}>
									{key}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				<img
					src={TankTypesSVGs[tankType]}
					alt={tankType as string}
					width={'25%'}
				/>
				<Button 
					variant="contained" 
					onClick={() => {
						onAdd({ 
							id: id,
							type: nodeType,
							position: { x: 0, y: 0 },
							data: { 
								label: tankLabel,
								tankType: tankType
							} 
						});
						resetState();
						onClose();
					}} 
					fullWidth
					disabled={tankLabel.length === 0}
				>
					Add
				</Button>
			</Stack>
		);
	};

	interface InstrumentationFormProps {
		onAdd: (node: IPAndIDNode) => void;
		onClose: () => void;
		id: string;
	}

	const InstrumentationFormContent = (props: InstrumentationFormProps) => {

		const { onAdd, id, onClose } = props;

		const [instrumentationType, setInstrumentationType] = useState<InstrumentationTypes>('');
		return (
			<Stack gap={2}>
				<FormControl
					fullWidth
					size='small'
				>
					<InputLabel id="instrumentation-type-select-label">Instrumentation Type</InputLabel>
					<Select
						labelId="instrumentation-type-select-label"
						id="instrumentation-type-select"
						value={instrumentationType as string}
						onChange={(event: SelectChangeEvent) => {
							setInstrumentationType(event.target.value as InstrumentationTypes);
						}}
						label="Instrumentation Type"
						required
					>
						{Object.values(PAndIDInstrumentationTypes).map((key: string) => (
							<MenuItem key={key} value={key}>
								{key}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Box 
					alignItems={'center'} 
					justifyItems={'center'} 
					position={'relative'}
				>
					<img
						src={InstrumentationSymbol}
						alt={instrumentationType as string}
						width={'100%'}
					/>
					<Box 
						position={'absolute'} 
						textAlign={'center'}
						top="50%" 
						left="50%" 
						sx={{
							transform: 'translate(-50%, -50%)', 
							zIndex: 2 
						}} 
						alignItems={'center'}
					>
						<Typography variant="body1" fontSize={80}>{instrumentationType}</Typography>
						{instrumentationType && <Typography variant="body1" fontSize={80}>000</Typography>}
					</Box>
				</Box>
				<Button 
					variant="contained" 
					onClick={() => {
						console.log(instrumentationType);
						onAdd({ 
							id: id,
							type: nodeType,
							position: { x: 0, y: 0 },
							data: { 
								label: instrumentationType as string,
								instrumentationType: instrumentationType
							} 
						});
						// resetState();
						onClose();
					}} 
					fullWidth
					disabled={instrumentationType === ''}
				>
					Add
				</Button>
			</Stack>
		);
	};

    return (
        <BaseDrawer
            transitionDuration={{ 
				enter: theme.transitions.duration.leavingScreen, 
				exit: theme.transitions.duration.leavingScreen 
			}}
            variant="persistent"
            open={openDrawer}
        >
			<Stack spacing={2} padding={2}>
				<Stack 
					direction="row" 
					spacing={2} 
					alignItems={'center'} 
					justifyContent={'space-between'} 
					width={'100%'}
				>
					<Typography  
						variant="h5" 
						sx={{ color: 'white', fontWeight: 600 }}
					>
						P&ID Node Builder
					</Typography>
					<IconButton onClick={() => {
						resetNode();
						setNodeBuilderDrawer();
					}}>
						<CloseIcon />
					</IconButton>
				</Stack>
				<Stack spacing={1}>
					<Typography variant="subtitle1">Node Type</Typography>
					<Stack direction="row" spacing={2}>
						<Chip 
							label="Valve" 
							sx={{ fontWeight: 600 }} 
							onClick={() => {
								setNodeType(PAndIDNodeTypes.VALVE)
							}} 
							color={nodeType == PAndIDNodeTypes.VALVE  ? 'primary' : 'default'}
						/>
						<Chip 
							label="Tank" 
							sx={{ fontWeight: 600 }} 
							onClick={() => {
								setNodeType(PAndIDNodeTypes.TANK);
							}}
							color={nodeType == PAndIDNodeTypes.TANK  ? 'primary' : 'default'}
						/>
						<Chip 
							label="Instrumentation" 
							sx={{ fontWeight: 600 }} 
							onClick={() => {
								setNodeType(PAndIDNodeTypes.INSTRUMENTATION)
							}}
							color={nodeType == PAndIDNodeTypes.INSTRUMENTATION  ? 'primary' : 'default'}
						/>
					</Stack>
				</Stack>
				{nodeType == PAndIDNodeTypes.VALVE && <ValveFormContent id={id} onAdd={onAdd} onClose={() => setNodeBuilderDrawer()}/>}
				{nodeType == PAndIDNodeTypes.TANK && <TankFormContent id={id} onAdd={onAdd} onClose={() => setNodeBuilderDrawer()}/>}
				{nodeType == PAndIDNodeTypes.INSTRUMENTATION && <InstrumentationFormContent id={id} onAdd={onAdd} onClose={() => setNodeBuilderDrawer()}/>} 
				
					
			</Stack>
        </BaseDrawer>
    );
};

interface HelpDrawerProps {
	helpDrawer: boolean;
	setHelpDrawer: () => void;
}

const HelpDrawer: React.FC<HelpDrawerProps> = (props: HelpDrawerProps) => {
	const { helpDrawer, setHelpDrawer } = props;
	const theme = useTheme();

    return (
        <BaseDrawer
			transitionDuration={{ 
				enter: theme.transitions.duration.leavingScreen, 
				exit: theme.transitions.duration.leavingScreen 
			}}
			variant="persistent"
			open={helpDrawer}
		>
			<Stack
				direction="column"
				padding={2}
				gap={2}
			>
				<Stack direction="row" spacing={2} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
					<Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>Help</Typography>
					<IconButton onClick={() => setHelpDrawer()} >
						<CloseIcon />
					</IconButton>
				</Stack>
				<Divider />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
					Keyboard Commands
				</Typography>
				<Divider />
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Chip label={'BackSpace'} sx={{ fontWeight: 600 }} />
					<Typography variant="body1" sx={{ color: 'white' }}>
						Delete selected 
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Stack direction={'row'} alignItems={'center'}>
						<Chip label={'Ctrl'} sx={{ fontWeight: 600 }} />
						<Typography p={0.5}>+</Typography>
						<Chip label={'Mouse Wheel'} sx={{ fontWeight: 600 }} />
					</Stack>
					<Typography variant="body1" sx={{ color: 'white' }}>
						Zoom
					</Typography>
				</Stack>
				
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Chip label={'Left Click'} sx={{ fontWeight: 600 }} />
					<Typography variant="body1" sx={{ color: 'white' }}> 
						Select 
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Stack direction={'row'} alignItems={'center'} >
						<Chip label={'Shift'} sx={{ fontWeight: 600 }} />
						<Typography p={0.5}>+</Typography>
						<Chip label={'Left Click'} sx={{ fontWeight: 600 }} />
					</Stack>
					<Typography variant="body1" sx={{ color: 'white' }}>Drag select</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Stack direction={'row'} alignItems={'center'}>
						<Chip label={'Ctrl'} sx={{ fontWeight: 600 }} />
						<Typography p={0.5}>+</Typography>
						<Chip label={'Z'} sx={{ fontWeight: 600 }} />
					</Stack>
					<Typography variant="body1" sx={{ color: 'white' }}>
						Restore Shortcut
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Stack direction={'row'} alignItems={'center'}>
						<Chip label={'Ctrl'} sx={{ fontWeight: 600 }} />
						<Typography p={0.5}>+</Typography>
						<Chip label={'S'} sx={{ fontWeight: 600 }} />
					</Stack>
					<Typography variant="body1" sx={{ color: 'white' }}>
						Save Shortcut
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Stack direction={'row'} alignItems={'center'}>
						<Chip label={'Ctrl'} sx={{ fontWeight: 600 }} />
						<Typography p={0.5}>+</Typography>
						<Chip label={'Mouse Wheel'} sx={{ fontWeight: 600 }} />
					</Stack>
					<Typography variant="body1" sx={{ color: 'white' }}>
						Zoom
					</Typography>
				</Stack>
				<Divider />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>Reference Guides</Typography>
				<Divider />
				<Link href={'https://drive.google.com/drive/folders/1FpAq5VcMlcpvSYLb3T4EX2wvGXIftLHa?usp=sharing'} target='_blank'>
					<Typography variant="body1">PDP Monitoring Docs</Typography>
				</Link>
				<Link href={'https://drive.google.com/drive/folders/1L5WAtktE5G_QPIZmBnmV_Xi1zLYX3coi?usp=sharing'} target='_blank'>
					<Typography variant="body1">PDP Docs</Typography>
				</Link>
				<Link href={'https://youtu.be/05_RjNkkwrc'} target='_blank'>
					<Typography variant="body1">UVR P&ID FeedSystem Video</Typography>
				</Link>
			</Stack>
		</BaseDrawer>
    );
};

interface LegendDrawerProps {
	legendDrawer: boolean;
	setLegendDrawer: () => void;
}

const LegendDrawer: React.FC<LegendDrawerProps> = (props: LegendDrawerProps) => {
	const { legendDrawer, setLegendDrawer } = props;
	const theme = useTheme();

    return (
        <BaseDrawer
			transitionDuration={{ 
				enter: theme.transitions.duration.leavingScreen, 
				exit: theme.transitions.duration.leavingScreen 
			}}
			variant="persistent"
			open={legendDrawer}
		>
			<Stack
				padding={2}
				spacing={2}
			>
				<Stack
					direction="row"
					spacing={1}
					alignItems={'center'}
					justifyContent={'space-between'}
					width={'100%'}
				>
					<Stack direction='row' alignItems={'center'} gap={1}>
						<Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>P&ID Legend</Typography>
					</Stack>
					<IconButton onClick={() => setLegendDrawer()} >
						<CloseIcon />
					</IconButton>
				</Stack>
				<Divider />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>Valves</Typography>
				<Divider />
				<Grid container gap={1} alignContent={'space-between'} justifyContent="space-between">
					{[...Array(10).keys()].map((i) => (
						<Grid key={i} item alignContent={'center'} justifyContent="center">
							<img src={ValveTypeSVGs[ValveTypeKeys[i]]} />
							<Typography
								paragraph
								variant="body1"
								textAlign={'center'}
								sx={{ color: 'white', whiteSpace: "pre-wrap" }}
							>
								{ValveTypeStrings[i].replace(/ /g, '\n')}
							</Typography>
						</Grid>
					))}
				</Grid>
				<Divider />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>Instrumentation</Typography>
				<Divider />
				<Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>Instrument Type</Typography>
				<Stack direction="row" spacing={1}>
					<Chip label={'(I)ndicator'} size='small'/>
					<Chip label={'(C)ontroller'} size='small'/>
					<Chip label={'(R)ecorder'} size='small'/>
				</Stack>
				<Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>Measurement Type</Typography>
				<Stack direction="row" spacing={1}>
					<Chip label={'(T)emperature'} size='small'/>
					<Chip label={'(P)ressure'} size='small'/>	
					<Chip label={'(L)evel'} size='small'/>
				</Stack>
			<img src={InstrumentationLegend} width={'100%'} />
				<Divider />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>Tanks</Typography>
				<Divider />
				<Stack direction="row" justifyContent={'space-around'}>
					{[...Array(3).keys()].map((i) => (
						<Stack key={i} direction="column" alignItems={'center'} justifyContent={'center'}>
							<img src={TankTypesSVGs[TankTypeKeys[i]]} />
							<Typography
								paragraph
								variant="body1"
								textAlign={'center'}
								sx={{ color: 'white', whiteSpace: "pre-wrap" }}
							>
								{TankTypeStrings[i].replace(/ /g, '\n')}
							</Typography>
						</Stack>
					))}
				</Stack>
			</Stack>
        </BaseDrawer>
    );
};

export { PAndIDBuilderDrawer, LegendDrawer, HelpDrawer };
