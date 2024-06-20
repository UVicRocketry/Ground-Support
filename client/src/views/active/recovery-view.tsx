import React, {  useState } from 'react';
import Header, { Breadcrumb } from "../../components/Header";
import { Card, CardContent, CardHeader, Grid, Icon, Modal, Paper, Stack, TextField, Typography, IconButton, CardActions, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';


// Icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import { useActiveMission } from '../../utils/ActiveMissionContext';
import GoogleMapReact, { MapOptions } from 'google-map-react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RocketIcon from '@mui/icons-material/Rocket';
import PinDropIcon from '@mui/icons-material/PinDrop';
import Longitude from '../../utils/Longitude.svg';
import Latitude from '../../utils/Latitude.svg'
import longLat from '../../utils/coordnates-graphic.png';
import InfoIcon from '@mui/icons-material/Info';
import RouteIcon from '@mui/icons-material/Route';
import { ViewKeys } from '../../utils/viewProviderContext';

export default function RecoveryView() {
    const activeContext = useActiveMission();
	const breadCrumbs: Breadcrumb[] = [
		{ name: "Ground Support", viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: false },
        { name: activeContext.rocket.Name, viewKey: ViewKeys.ROCKET_DETAILS_KEY, active: false },
		{ name: activeContext.activeMission.Name || "New Mission", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true },
		{ name: "Recovery", viewKey: ViewKeys.ACTIVE_FLIGHT_KEY, active: true }
	];

    const [detailsOpen, setDetailsOpen] = useState(false);


    const defaultProps = {
        center: {
          lat: activeContext.activeMission.Coordinates.Latitude || 48.461223,
          lng: activeContext.activeMission.Coordinates.Longitude || -123.309765
        },
        zoom: 15
      };
      
	return (
		<Grid 
			container 
			direction="column" 
			paddingX="2rem" 
			paddingY="2rem" 
			gap={3}
		>
			<Grid container>
				<Header icon='ROCKET_MONITORING' breadCrumbs={breadCrumbs} />
			</Grid>
            <Grid item>
                <Paper elevation={2} sx={{ padding: 2 }}>
                    <Stack direction="row" spacing={5} justifyContent={'space-between'} alignItems={'center'}>
                        <Stack direction="row" alignItems={'center'} spacing={2}>
                            <RouteIcon color={'primary'} /> 
                            <Typography align='left' variant='h5'>
                                {activeContext.activeMission.Name || 'Mission Not found'}
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item width={'100%'} height={'60vh'} display={'flex'}>
                <Card 
                    sx={{ 
                        maxWidth: 250, 
                        position: 'relative' 
                    }}
                    >
                    <CardHeader title="Recovery Details" />
                    <Stack direction={'row'} bottom={0}>
                        {[
                            'uvr.red',
                            'uvr.yellow',
                            'uvr.lightBlue',
                            'uvr.darkBlue'
                        ].map((c) => <Box sx={{backgroundColor: c}} width={'25%'} height={10}/>)}
                    </Stack>
                    <CardContent>
                        <Stack direction={'column'} gap={2} paddingY={1}>
                            <Stack direction={'row'} gap={1}>
                                <RocketLaunchIcon sx={{ color: 'uvr.lightBlue' }}/>
                                Launch Location
                            </Stack>
                            <Stack direction={'row'} gap={2}>
                                <TextField 
                                    id="Launch-Location-Lat" 
                                    label="Latitude"
                                    value={activeContext.activeMission.Coordinates.Latitude} 
                                    variant="outlined" 
                                />
                                <TextField 
                                    id="Launch-Location-long" 
                                    label="Longitude"
                                    value={activeContext.activeMission.Coordinates.Longitude} 
                                    variant="outlined" 
                                />
                            </Stack>
                            <Stack direction={'row'} gap={1}>
                                <RocketIcon sx={{ color: 'uvr.red' }}/>
                                Recovery Location
                            </Stack>
                            <Stack direction={'row'} gap={2}>
                                <TextField 
                                    id="Launch-Location-Lat" 
                                    label="Latitude"
                                    value={'N/a'} 
                                    variant="outlined" 
                                />
                                <TextField 
                                    id="Launch-Location-long" 
                                    label="Longitude"
                                    value={'N/a'} 
                                    variant="outlined" 
                                />
                            </Stack>
                            
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={() => setDetailsOpen(true)}>
                            <InfoIcon />
                        </IconButton>
                    </CardActions>
                </Card>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    // mapTypeId='terrain'
                    options={{
                        mapTypeId:'satellite'
                    }}
                >
                    <PinDropIcon color='error'></PinDropIcon>
                </GoogleMapReact>
            </Grid>
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
            >
                <DialogTitle>Coordinates Details</DialogTitle>
                <DialogContent>
                    <img src={longLat} style={{borderRadius: 5, maxWidth: 550}}/>
                </DialogContent>
            </Dialog>
		</Grid>
	);
}
