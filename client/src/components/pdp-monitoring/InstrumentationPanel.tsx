import { Chip, Grid, Paper, Stack, Switch, Tooltip, Typography, styled, } from '@mui/material';
import React, { useEffect, useState } from 'react';

import SensorsIcon from '@mui/icons-material/Sensors';
import { InstrumentationModule, InstrumentationType_t } from './InstrumentationModule';

interface IProps {
  // props
  phone?: boolean;
}

const InstrumentationPanel: React.FC<IProps> = (props: IProps) => {
    // state
    const [data, setData] = useState<any>(null);

    // render
    return (
        <Stack spacing={2} width={'100%'}>
            <Paper elevation={2} sx={{ padding: 2 }}>
                <Stack direction="row" alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction="row" alignItems={'center'} spacing={2}>
                        <SensorsIcon color={'primary'} /> 
                        <Typography align='left' variant='h6'>
                            Instrumentation
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
            <Grid 
                container
                gap={2}
            >
                <InstrumentationModule title={"Run Tank"} type={InstrumentationType_t.PRESSURE}/>
                <InstrumentationModule title={"N2O Flow"} type={InstrumentationType_t.PRESSURE}/>   
                <InstrumentationModule title={"N2 Flow"} type={InstrumentationType_t.PRESSURE}/>
                <InstrumentationModule title={"Injector"} type={InstrumentationType_t.PRESSURE}/>
                <InstrumentationModule title={"Run Tank"} type={InstrumentationType_t.TEMPERATURE}/>
                <InstrumentationModule title={"Run Tank"} type={InstrumentationType_t.MASS}/>
                <InstrumentationModule title={"ShuntCurrent"} type={InstrumentationType_t.LOAD}/>
                               
            </Grid>
        </Stack>
        
    );
};

export default InstrumentationPanel;