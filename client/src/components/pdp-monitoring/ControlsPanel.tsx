import { Button, FormControl, FormControlLabel, FormGroup, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import {  ControlsValveTypes } from '../../utils/monitoring-system/monitoring-types';
import ValveControl from './ValveControlSwitch';

const ControlsPanel: React.FC = () => (
    <Paper
        elevation={2}
        sx={{ padding: 2, width: "fit-content", height: "fit-content"}}
    >
        <FormControl component="fieldset">
            <Stack direction={'row'}>
                <ValveControl valveName={ControlsValveTypes.N2OFlow} />
                <ValveControl valveName={ControlsValveTypes.N2OVent} />
            </Stack>
            <Stack direction={'row'}>
                <ValveControl valveName={ControlsValveTypes.N2Flow} />
                <ValveControl valveName={ControlsValveTypes.ERV} />
            </Stack>
            <Stack direction={'row'}>
                <ValveControl valveName={ControlsValveTypes.RTV} />
                <ValveControl valveName={ControlsValveTypes.NCV} />
            </Stack>
            <FormGroup>
            </FormGroup>
            <FormControlLabel 
                sx={{ marginTop: 1 }}
                control={<Button fullWidth variant='contained' color="error" disabled>ENERGIZED</Button>} 
                label={<Typography alignSelf='start'>Run Tank</Typography>}
                labelPlacement='top' 
            />
            <Button fullWidth variant='contained' color="error" sx={{ marginTop: 2, fontSize: 40, fontWeight: 600 }}>Abort</Button>
        </FormControl>
    </Paper>
);


export default ControlsPanel;