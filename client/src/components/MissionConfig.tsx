import React, { useCallback, useEffect, useState } from "react";
import { Button, Dialog, TextField, Stack, DialogContent, Typography, Checkbox, FormControlLabel, InputAdornment, Tooltip, IconButton, DialogActions, Select, MenuItem, OutlinedInput, Box, Chip, FormControl, InputLabel, DialogTitle, Autocomplete  } from "@mui/material";
import { IComponent, IMission, IRocket, IRocketPopulated } from "../utils/entities";
import api from "../services/api";

interface MissionConfigProps {
    missionId?: string;
    rocket: IRocketPopulated;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

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

const MissionConfig: React.FC<MissionConfigProps> = (props: MissionConfigProps) => {
    const { rocket, missionId, isOpen, onClose, onSave } = props;
    const [missionName, setMissionName] = useState<string | null>();
    const [latitude, setLatitude] = useState<number | null>();
    const [longitude, setLongitude] = useState<number | null>();
    const [launchDate, setLaunchDate] = useState<Date | null>();
    const [altitude, setAltitude] = useState<number | null>();
    const [selectedComponents, setSelectedComponents] = useState<string[] | []>([]);
    const [components, setComponents] = useState<IComponent[]>([]);
    const [isTest, setIsTest] = useState<boolean>(false);

    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const getComponents = useCallback(async () => {
        console.log('rocket', rocket);
        try {
            if (rocket) {
                rocket.Components.map( async (component: IComponent) => {
                    setComponents((prev) => [...prev, component]);
                });
            }
        } catch (error) {
            console.error(error);
        } 
    }, []);

    const handleSave = async() => {
        const saveMission = async () => {
            const payload = {
                Name: missionName,
                Date: launchDate,
                IsTest: false,
                IsActive: false,
                Coordinates: {
                    Longitude: longitude,
                    Latitude: latitude
                },
                LaunchAltitude: altitude,
                Published: false,
                Components: selectedComponents
            } as IMission;

            console.log('payload frontend', payload)

            if (missionId) {
                await api.updateMission(missionId, payload);
            } else {
                await api.createMission(payload, rocket);
            }
        };
        await saveMission();
        close();
    };

    const close = () => {
        setMissionName(null);
        setLatitude(null);
        setLongitude(null);
        setLaunchDate(null);
        setAltitude(null);
        setSelectedComponents([]);
        onClose();
    }

    const getMission = async () => {
        let response;
        if (missionId) {
            response = await api.getMission(missionId);
            console.log(response); 
        }
        const data = response.data as IMission;
        setMissionName(data.Name);
        setLatitude(data.Coordinates.Latitude);
        setLongitude(data.Coordinates.Longitude);
        setLaunchDate(new Date(data.Date));
        setAltitude(data.LaunchAltitude as number);
        setSelectedComponents(data.Components);
    }

    useEffect(() => {
        getMission();
        setIsEditMode(true);
    }, [missionId])

    useEffect(() => {
        // clear the components array
        setComponents([]);
        getComponents();
    }, []);

    return(
        <Dialog open={props.isOpen} fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
                Mission Configuration
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={3} alignItems="left">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            InputLabelProps={{
                                shrink: isEditMode
                            }} 
                            required
                            variant="outlined" 
                            type="String"
                            fullWidth
                            size="small"
                            label="Mission Name"
                            value={missionName}
                            onChange={(e) => {
                                setMissionName(e.target.value as string)
                            }}
                        />
                        <Tooltip title="Data Collected is for testing purposes">
                            <FormControlLabel 
                                value="Test" 
                                control={<Checkbox defaultChecked />} 
                                label="Test"
                                labelPlacement="start"
                            />
                        </Tooltip>
                        {/* still need to add a state for the checkbox */}
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField 
                            InputLabelProps={{
                                shrink: isEditMode
                            }} 
                            required
                            variant="outlined" 
                            type="String"
                            fullWidth
                            size="small"
                            label="Mission Location (Latitude)"
                            value={latitude}
                            onChange={(e) => {
                                setLatitude(e.target.value as number);
                            }}
                        />
                        <TextField 
                            InputLabelProps={{
                                shrink: isEditMode
                            }} 
                            required
                            variant="outlined" 
                            type="String"
                            fullWidth
                            size="small"
                            label="Mission Location (Longitude)"
                            value={longitude}
                            onChange={(e) => {
                                setLongitude(e.target.value as number);
                            }}
                        />
                    </Stack>
                    <TextField 
                        InputLabelProps={{
                            shrink: isEditMode
                        }} 
                        required
                        variant="outlined" 
                        type="Date"
                        fullWidth
                        size="small"
                        label="Launch Date"
                        InputLabelProps={{ shrink: true }}
                        value={launchDate}
                        onChange={(e) => {
                            setLaunchDate(e.target.value as Date);
                        }}
                    />
                    <TextField 
                        InputLabelProps={{
                            shrink: isEditMode
                        }} 
                        required
                        variant="outlined" 
                        type="Number"
                        fullWidth
                        size="small"
                        label="Launch Altitude"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                        }}
                        value={altitude}
                        onChange={(e) => {
                            setAltitude(e.target.value as number);
                        }}
                    />
                    <Autocomplete 
                        fullWidth
                        size="small"
                        multiple
                        id="tags-outlined"
                        options={components}
                        getOptionLabel={(option) => option.Name}
                        filterSelectedOptions
                        onChange={(e, value) => {
                            setSelectedComponents(value.map((component: IComponent) => component._id as string));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Configure Components"
                                placeholder="Select Components"
                            />
                        )}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default MissionConfig;