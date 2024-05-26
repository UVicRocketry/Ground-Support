import { 
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
import React, { useState, useCallback } from 'react';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';


import { ValveTypeKeys, ValveTypeStrings, ValveTypes } from '../../../static/valves/ValveTypes';
import { IPAndIDNode, PAndIDNodeTypes } from '../../../utils/monitoring-system/monitoring-types';

// images
import Tank from '../../../static/tanks/Tank.svg';
import GasBottle from '../../../static/tanks/Gas Bottle.svg';
import VerticalVessel from '../../../static/tanks/Vertical Vector.svg';
import InstrumentationLegend from '../../../static/InstrumentationLegend.svg';
import { Position } from 'reactflow';

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
}

const PAndIDBuilderDrawer: React.FC<PAndIDBuilderProps> = (props: PAndIDBuilderProps) => {
	const { openDrawer, setNodeBuilderDrawer, onAdd } = props;

	const theme = useTheme();
	// Node builder form state
	const [label, setLabel] = useState<string>('');
	const [valveType, setValveType] = useState(ValveTypeKeys[0]);
	const [controllable, setControllable] = useState(false);

	const [node, setNode] = useState<IPAndIDNode>({
		id: 'horizontal-1',
		type: 'valveNode',
		data: {
			label: 'MEC',
			controllable: false,
			nodeType: PAndIDNodeTypes.VALVE,
			valveType: ValveTypeKeys[0]
		},
		position: { x: 0, y: 0 },
		sourcePosition: Position.Right,
		targetPosition: Position.Left
	});

	// Node builder Handlers 
	const updateType = useCallback((type: string) => {
		setNode({ ...node, type: type });
	}, [node]);

	const updateLabel = useCallback((label: string) => {
		setNode({ ...node, data: { ...node.data, label: label } });
	}, [label]);

	const updateControllable = useCallback((controllable: boolean) => {
		setNode({ ...node, data: { ...node.data, controllable: controllable } });
	}, [controllable]);


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
				<Stack direction="row" spacing={2} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
					<Typography  variant="h5" sx={{ color: 'white', fontWeight: 600 }}>P&ID Node Builder</Typography>
					<IconButton onClick={() => setNodeBuilderDrawer()} >
						<CloseIcon />
					</IconButton>
				</Stack>
				<Stack spacing={1}>
					<Typography variant="subtitle1">Node Type</Typography>
					<Stack direction="row" spacing={2}>
						<Chip label="Valve" sx={{ fontWeight: 600 }} onClick={() => {}} color='primary'/>
						<Chip label="Tank" sx={{ fontWeight: 600 }} onClick={() => {}}/>
						<Chip label="Instrumentation" sx={{ fontWeight: 600 }} onClick={() => {}}/>
					</Stack>
				</Stack>
				<Stack direction="row" spacing={2}>
					<FormControl
						fullWidth
						size='small'
					>
						<InputLabel id="valve-type-select-label">Valve Type</InputLabel>
						<Select
							labelId="valve-type-select-label"
							id="valve-type-select"
							value={valveType}
							onChange={(event: SelectChangeEvent) => {
								setValveType(event.target.value as typeof ValveTypeKeys[number]);
							}}
							label="Valve Type"
						>
							{ValveTypeStrings.map((key: string, index: number) => (
								<MenuItem value={ValveTypeKeys[index]}>
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
								updateControllable(controllable);
							}}
							size='small'
							>
								<CheckIcon />
						</ToggleButton>
					</Tooltip>
				</Stack>
				<TextField
					id="node-label"
					label="Valve Label"
					variant="outlined"
					size='small'
					fullWidth
					/>
				<img
					src={ValveTypes[valveType]}
					alt={valveType}
					width={'100%'}
				/>
				<Stack direction="row" spacing={2}>
					<Button 
						variant="contained" 
						onClick={() => onAdd(node)} 
						fullWidth
					>
						Add
					</Button>
				</Stack>
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
				<Divider />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>Reference Guides</Typography>
				<Divider />
				<Link href={'https://drive.google.com/drive/folders/1FpAq5VcMlcpvSYLb3T4EX2wvGXIftLHa?usp=sharing'} target='_blank'>
					<Typography variant="body1">PDP Monitoring Docs</Typography>
				</Link>
				<Link href={'https://drive.google.com/drive/folders/1L5WAtktE5G_QPIZmBnmV_Xi1zLYX3coi?usp=sharing'} target='_blank'>
					<Typography variant="body1">PDP Docs</Typography>
				</Link>
				<Link href={''} target='_blank'>
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
						<Grid item alignContent={'center'} justifyContent="center">
						<img src={ValveTypes[ValveTypeKeys[i]]} />
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
				<img src={InstrumentationLegend} width={'100%'} />
				<Divider />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>Tanks</Typography>
				<Divider />
				<Stack direction="row" spacing={2}>
					<img src={Tank} />
					<img src={VerticalVessel} />
					<img src={GasBottle} />
				</Stack>
			</Stack>
        </BaseDrawer>
    );
};

export { PAndIDBuilderDrawer, LegendDrawer, HelpDrawer };
