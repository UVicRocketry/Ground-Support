import { CloudUpload, Info } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
	Alert,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	TextField,
	Tooltip,
	InputAdornment
} from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { parseJsonFile } from '../../utils/data-parser';
import { IComponent, IComponentPopulated, IRocket } from '../../utils/entities';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

interface ComponentModalProps {
	component?: IComponentPopulated;
	rocket?: IRocket;
	isOpen: boolean;
	onSave: (id: string) => void;
	onClose: () => void;
}

interface dataConfigStructure {
	config: {};
	data: { results: { [key: string]: any } };
	headers: {};
	request: {};
	status: number;
	statusText: string;
}

const ComponentModal = (props: ComponentModalProps) => {
	const { component, rocket } = props;

	const [name, setName] = useState<string>('');
	const [details, setDetails] = useState<string>('');
	const [sourceType, setSourceType] = useState<string>('');
	const [editMode, setEditMode] = useState<boolean>(!!component || false);
	const [componentId, setComponentId] = useState<string>('');

	const [errorBar, setErrorBar] = useState({
		show: false,
		message: 'Error Occured'
	});
	const [configFile, setConfigFile] = useState<File | null>(null);
	const parsedConfigFile = useRef<{ [key: string]: Object }>({});

	const handleChange = (e: any, setState: Function) => {
		if (!editMode) {
			setEditMode(true);
		}
		setState(e.target.value);
	};

	const resetState = () => {
		setName('');
		setDetails('');
		setSourceType('');
		setEditMode(false);
		setComponentId('');
		setConfigFile(null);
		parsedConfigFile.current = {};
	};

	const attachComponentToRocket = async (cId: string) => {
		if (rocket)
			rocket.Components.push(cId);
		try {
			console.log('rocket data in attach component to rocket');
			console.log(!!rocket ? rocket : null);
			await axios.patch(`http://127.0.0.1:9090/rocket/${rocket?._id}`, rocket);
		} catch (error) {
			setErrorBar({ message: 'Component Failed to attach to Rocket', show: true });
		}
	};

	const save = async (): Promise<boolean> => {
		let dataConfigResponse: dataConfigStructure;
		if (componentId && configFile) {
			dataConfigResponse = await axios.patch(
				`http://127.0.0.1:9090/DataConfig/${component?.DataConfigId}`, 
				parsedConfigFile.current
			);
		} else {	
			dataConfigResponse = await axios.post(
				`http://127.0.0.1:9090/DataConfig`,
				parsedConfigFile.current
			);
		}
		
		let dataConfigId: string;
		if (dataConfigResponse['status'] === 201) {
			if ('data' in dataConfigResponse) {
				dataConfigId = dataConfigResponse['data']['results']['_id'];
			} else {
				dataConfigId = '';
			}
		} else {
			setErrorBar({ message: 'DataConfig Upload Failed', show: true });
			return false;
		}

		const payload: IComponent = {
			Name: name,
			DataConfigId: dataConfigId,
			TelemetrySource: sourceType,
			Details: details
		};
	
		let response: any;
		try {
			if (componentId) {
				response = await axios.patch(
					`http://127.0.0.1:9090/component/${componentId}`,
					payload
				);
			} else {
				response = await axios.post(
					`http://127.0.0.1:9090/component`,
					payload
				);
			}
		} catch (error) {
			setErrorBar({ message: 'Component Upload Failed', show: true });
			return false;
		} finally {
			const data = response.data.results ? response.data.results : response.data.results;
			console.log('component post / patch data')
			console.log(data);
			setComponentId(data['_id']);
			debugger;
			await attachComponentToRocket(data['_id']);
			props.onSave(data['_id']);
			return true;
		}
	};

	const saveAndClose = async () => {
		try {
			await save();
		} catch {
			setErrorBar({ message: 'Component Upload Failed', show: true });
		} finally {
			props.onSave(componentId);
			if (!errorBar.show) {
				props.onClose();
				resetState();
			}
		};
	};

	const onUploadFile = (event: any): void => {
		setConfigFile(event.target.files[0]);
	};

	const clearUploadFile = (): void => {
		setConfigFile(null);
	};

	const parseUploadedFileToJson = useCallback(async () => {
		let response: { [key: string]: Object } = await parseJsonFile(configFile);
		parsedConfigFile.current = response;
	}, [configFile]);

	useEffect(() => {
		parseUploadedFileToJson();
	}, [parseUploadedFileToJson]);

	useEffect(() => {
		resetState();
		if (component) {
			setEditMode(true);
			setName(component.Name);
			setDetails(component.Details);
			setSourceType(component.TelemetrySource ? component.TelemetrySource : '');
			setComponentId(component._id ? component?._id : '');
		}
	}, [component]);

	return (
		<Dialog open={props.isOpen} fullWidth>
			<DialogTitle sx={{ typography: 'h4' }}>Component</DialogTitle>
			<DialogContent>
				<FormControl fullWidth>
					<Stack sx={{ paddingTop: '5px' }} direction="column" spacing={3} alignItems="left">
						{errorBar.show && (
							<Alert
								variant="filled"
								severity="error"
								action={
									<IconButton
										aria-label="close"
										color="inherit"
										size="small"
										onClick={() => {
											setErrorBar({ ...errorBar, show: false });
										}}
									>
										<CloseIcon fontSize="inherit" />
									</IconButton>
								}
							>
								{errorBar.message}
							</Alert>
						)}
						<Stack direction="row" spacing={3}>
							<TextField
								InputLabelProps={{ shrink: editMode }}
								type="String"
								value={name}
								onChange={(e) => handleChange(e, setName)}
								fullWidth
								size="small"
								id="component-name"
								label="Name"
								variant="outlined"
							/>
						</Stack>
						<Stack direction="row" spacing={3}>
							<TextField
								InputLabelProps={{ shrink: editMode }}
								type="String"
								value={details}
								onChange={(e) => handleChange(e, setDetails)}
								fullWidth
								size="small"
								id="component-name"
								label="Details"
								variant="outlined"
							/>
						</Stack>
						<Stack direction="row" spacing={2}>
							<FormControl fullWidth variant="filled">
								<InputLabel id="component-source-label">Telemetry Source</InputLabel>
								<Select
									id="component-source"
									variant="filled"
									fullWidth
									value={sourceType}
									onChange={(e) => handleChange(e, setSourceType)}
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
									MenuProps={MenuProps}
									labelId="component-source-label"
									label=""
								>
									<MenuItem key="LORA" value="LORA">
										LORA
									</MenuItem>
									<MenuItem key="APRS" value="APRS">
										APRS
									</MenuItem>
								</Select>
							</FormControl>
						</Stack>
						<Stack direction="row" spacing={1}>
							{configFile && (
								<TextField
									size="small"
									fullWidth
									value={configFile?.name}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<IconButton onClick={clearUploadFile}>
													<CloseIcon />
												</IconButton>
											</InputAdornment>
										)
									}}
								/>
							)}
							<input
								accept="json/*"
								hidden
								className={'button'}
								id="contained-button-file"
								onChange={onUploadFile}
								type="file"
							/>
							<label style={{ width: '95%' }} htmlFor="contained-button-file">
								<Button
									variant="contained"
									component="span"
									className={'button'}
									size="large"
									startIcon={<CloudUpload />}
									fullWidth
								>
									{!configFile && (component?.DataConfigId ? 'overwrite config' : 'Data Configuration')}
								</Button>
							</label>
							<Tooltip
								title="dataconfig is a json file that specifies the expected Components, FieldGroups, and Fields"
								placement="top"
								arrow
							>
								<IconButton size="medium">
									<Info />
								</IconButton>
							</Tooltip>
						</Stack>
					</Stack>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button onClick={saveAndClose}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ComponentModal;
