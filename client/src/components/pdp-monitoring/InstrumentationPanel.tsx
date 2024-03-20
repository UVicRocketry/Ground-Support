import { Chip, Grid, Paper, Stack, Switch, Tooltip, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';

import SensorsIcon from '@mui/icons-material/Sensors';
import InstrumentationReadingCard from './InstrumentationReadingCard';

interface IProps {
  // props
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
                <InstrumentationReadingCard />
                <InstrumentationReadingCard />
                <InstrumentationReadingCard />
                <InstrumentationReadingCard />
                <InstrumentationReadingCard />
                <InstrumentationReadingCard />
            </Grid>
            
        </Stack>
    );
};

export default InstrumentationPanel;