import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSocketContext } from '../../utils/socket-context';
import "leaflet.offline";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button, Chip, Drawer, Fab, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useActiveMission } from '../../utils/ActiveMissionContext';
import { LocationOn } from '@mui/icons-material';

interface ITelemetryMapProps {
    width?: number;
}

const TelemetryMap: React.FC<ITelemetryMapProps> = (props: ITelemetryMapProps) => {
    const { width } = props;

    const theme = useTheme();
    const socketContext = useSocketContext();
    const activeMissionContext = useActiveMission();

    const [offlineMap, setOfflineMap] = useState<boolean>(false);
    const [mapState, setMapState] = useState(null);
    const [mapDetails, setMapDetails] = useState<boolean>(false);
        
    // UVic Coordinates 48.461140, -123.310637
    const position = [
        activeMissionContext.activeMission.Coordinates.Latitude, 
        activeMissionContext.activeMission.Coordinates.Longitude,
    ];


    const displayMap = useMemo(() => (
        <MapContainer 
            //@ts-ignore
            center={position}
            //@ts-ignore
            ref={setMapState}
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ 
                height: 180, 
                width: '100%', 
                borderRadius: '5px', 
                zIndex: 4 
            }}
        >
            
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker 
                //@ts-ignore
                position={position}
            >
                <Popup>
                    Launch Position
                </Popup>
            </Marker>
        </MapContainer>
    ), []);

    // @ts-ignore
    interface IMapProps {
        map: any;
    }

    const CurrentPosition = (props: IMapProps) => {
        const { map } = props;

        const [currentMapPosition, setCurrentMapPosition] = useState(() => map.getCenter() as any);
    
        const onMove = useCallback(() => {
            setCurrentMapPosition(map.getCenter())
        }, [map]);
    
        useEffect(() => {
            map.on('move', onMove)
            return () => {
                map.off('move', onMove)
            }
        }, [map, onMove]);

        return (
            <Stack direction='row' spacing={1}>
                <Chip
                    icon={<LocationOn />}
                    //@ts-ignore
                    label={`(${currentMapPosition.lat.toFixed(4)}, ${currentMapPosition.lng.toFixed(4)})`}
                    color='default'
                    sx={{ 
                        fontWeight: 600, 
                        borderRadius: 2 
                    }}
                />
            </Stack>
        );
    };

    return (
        <Paper
            sx={{
                borderRadius: 2,
                padding: 2,
                width: width || '100%',
                minWidth: 'fit-content',
                height: 'fit-content'
            }}
        >
            <Stack direction={'column'} spacing={2}>
                <Drawer
                    sx={{
                        position: 'relative',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            borderRadius: 2,
                            padding: 2,
                            boxShadow: 5,
                            height: 'fit-content',
                            width: '100%',
                            boxSizing: 'border-box',
                            position: 'absolute',
                            backgroundColor: theme.palette.background.paper
                        },
                        backgroundColor: theme.palette.background.paper,
                        width: 400,
                        height: 'fit-content',
                        zIndex: 5,
                        // boxShadow: 5
                    }}
                    elevation={3}
                    variant="persistent"
                    open={mapDetails}
                    onClose={() => setMapDetails(false)}
                    transitionDuration={{ 
                        enter: theme.transitions.duration.leavingScreen, 
                        exit: theme.transitions.duration.leavingScreen 
                    }}
                    anchor='right'
                >
                    <Typography 
                        variant='subtitle1'
                        fontWeight={600}
                    >
                        Launch Coordinates
                    </Typography>
                    <Stack direction='row' spacing={1}>
                        <Chip 
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                fontWeight: 600
                            }}
                            label={`Longitude: ${activeMissionContext.activeMission.Coordinates.Longitude}`}
                            color='default'
                        />
                        <Chip 
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                fontWeight: 600
                            }}
                            label={`Latitude: ${activeMissionContext.activeMission.Coordinates.Latitude}`}
                            color='default'
                        />
                    </Stack>
                </Drawer>
                { displayMap }
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    { mapState ? <CurrentPosition map={mapState} /> : null }
                    <Button
                        variant='contained'
                        onClick={() => setMapDetails(!mapDetails)}
                    >
                        Map Details
                    </Button>
                </Stack>
            </Stack>
           
        </Paper>
    );
}

export default TelemetryMap;