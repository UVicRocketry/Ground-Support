import { Button, ButtonGroup, FormControl, FormControlLabel, FormGroup, Paper, Stack, Switch, Typography } from '@mui/material';
import React, { useEffect, useState, useReducer } from 'react';
import { sequenceReducer, updateSequence } from './sequenceReducer';

// Icons
import KeyIcon from '@mui/icons-material/Key';

interface IProps {
  // props
}

const StartSequencePanel: React.FC<IProps> = (props: IProps) => {
    // state
    const [keyIn, setKeyIn] = useState(false);
    const [sequence, dispatch] = useReducer(sequenceReducer, { state: 'key' });
    const [overRide, setOverRide] = useState(false);
    // effects
    useEffect(() => {
        if (sequence.state === "key" && keyIn) {
            updateSequence(sequence, dispatch);
        }
    }, [sequence.state]);

    // render
    return (
        <Stack spacing={2} direction={'column'}>
             <Button 
                    variant='contained'
                    color='error'
                    sx={{ width: "100%", height: 100 }}
                >
                    <Typography variant='h4'>ABORT</Typography>
            </Button>
            <Paper
                elevation={2}
                sx={{ padding: 2, width: "fit-content" }}
            >
                <FormControl component="fieldset">
                    <Stack direction={'row'}>
                        <ButtonGroup variant="contained" color="primary" aria-label="key-button-group" orientation='vertical'>
                            <Button 
                                variant='contained' 
                                startIcon={<KeyIcon />} 
                                disabled={!keyIn} 
                                color="primary"
                                aria-readonly={true}
                            >
                                KEY
                            </Button>
                            <Button 
                                color={overRide ? "primary" : "grey" }
                                variant='contained' 
                                onClick={() => setOverRide(!overRide)}
                            >
                                OVERRIDE
                            </Button>
                        </ButtonGroup>
                        <FormControlLabel 
                            sx={{ width: "fit-content" }} 
                            control={<Switch disabled={!(sequence.state === "prime") && !overRide} onChange={() => sequence.state === "prime" ? updateSequence(sequence, dispatch) : null} />} 
                            label="Prime" 
                            labelPlacement='bottom' 
                        />
                        <Button 
                            variant="contained" 
                            disabled={!overRide  &&  !(sequence.state === "ignite")}
                            onClick={() => sequence.state === "ignite" ? updateSequence(sequence, dispatch) : null}
                        >
                            Ignite
                        </Button>
                        <FormControlLabel 
                            sx={{ width: "fit-content" }} 
                            control={<Switch disabled={!overRide &&  !(sequence.state === "mev")} />} 
                            label="MEV" 
                            labelPlacement='bottom' 
                            onChange={() => sequence.state === "mev" ? updateSequence(sequence, dispatch) : null}
                        />
                    </Stack>
                </FormControl>
            </Paper>
        </Stack>
    );
};

export default StartSequencePanel;