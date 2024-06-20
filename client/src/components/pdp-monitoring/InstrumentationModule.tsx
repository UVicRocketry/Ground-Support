import { MoreVert } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Paper, Popper, Stack, Tooltip, Typography } from '@mui/material';
import { Menu, MenuItem, } from '@mui/material';
import VisualizationMenu from "./VisualizationMenu"; //In progress to make the menu code a component
import React, { useEffect, useState } from 'react';
import InsGraph from "./InstrumentationGraph";



export enum InstrumentationType_t {
    TEMPERATURE = 'Temperature',
    PRESSURE = 'Pressure',
    FORCE = 'Force',
    MASS = 'Mass'
}

interface IInstrumentationReadingType {
    label: string;
    color: string;
    med: number; //Threshold to show yellow
    hi: number; //Threshold to show red
}

interface IInstrumentationModuleProps {
    title: string;
    type: InstrumentationType_t;
    state: string; //This is the color shown on the reading box
}

export const InstrumentationModule: React.FC<IInstrumentationModuleProps> = (props: IInstrumentationModuleProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    
    const open = Boolean(anchorEl);
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const { title, type } = props;

    const [InstrumentationType, setInstrumentationType] = useState<IInstrumentationReadingType>({
        label: "",
        color: ""
    });

    useEffect(() => {
        switch (type) {
            case InstrumentationType_t.TEMPERATURE:
                setInstrumentationType({
                    label: "T",
                    color: "#D65B4F",
                    med: 773, //Kelvin
                    hi:973
                });
                break;
            case InstrumentationType_t.LOAD:
                setInstrumentationType({
                    label: "L",
                    color: "#FFC557",
                    med: 20,
                    hi:30
                });
                break;
            case InstrumentationType_t.PRESSURE:
                setInstrumentationType({
                    label: "P",
                    color: "#005EB8",
                    med: 750, //psi
                    hi:800
                });
                break;
            case InstrumentationType_t.MASS:
                setInstrumentationType({
                    label: "M",
                    color: "#3FB684",
                    med: 50, //kg
                    hi: 25
                });
                break;
        }

    }, []);
//Sets the color of the reading depending if its safe or not
    // useEffect(() => {
	// 	if (packet?.Parsed.altitude > 0) { //Change to Parsed.pressure to get the measurement
	// 				Altitude: packet?.Parsed.altitude //Change to pressure, temp, load, mass
    //                 switch (Altitude){
    //                     case (Altitude<InstrumentationType.med):
    //                         alert: "#419769" //Green
    //                         break;
    //                     case (Altitude>=InstrumentationType.med && Altitude <InstrumentationType.hi):
    //                         alert: "#D79C00" //Yellow
    //                         break;
    //                     case (Altitude>=InstrumentationType.hi):
    //                         alert: "#D65B4F" //Red
    //                         break;
    //                 }
                    
			
	// 	}
	// }, [packet]);
    

    return (
        <Card sx={{ maxWidth: 250, maxHeight: 250 }}>
            <CardHeader
                sx={{ backgroundColor: '#42464D', color: 'white'}}
                title={title}
                action={
                    <Stack direction={"row"} marginX={1}>
                        <Popper
                            open={false}
                            placement="bottom-start"
                            disablePortal={false}
                            modifiers={[
                                {
                                name: 'flip',
                                enabled: true,
                                options: {
                                    altBoundary: true,
                                    rootBoundary: 'document',
                                    padding: 8,
                                },
                                },
                                {
                                name: 'preventOverflow',
                                enabled: true,
                                options: {
                                    altAxis: true,
                                    altBoundary: true,
                                    tether: true,
                                    rootBoundary: 'document',
                                    padding: 8,
                                },
                                },
                                {
                                name: 'arrow',
                                enabled: false,
                                },
                            ]}
                        >
                            <Paper>
                                <Stack direction="column">
                                    <Button>Settings</Button>
                                    <Button>Calibrate</Button>
                                </Stack>
                            </Paper>
                        </Popper>

                        <div>
                            <IconButton
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <MoreVert/>
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>Graph</MenuItem>
                                <MenuItem onClick={handleClose}>Value</MenuItem>
                                <MenuItem onClick={handleClose}>Graph and Value</MenuItem>
                            </Menu>
                        </div>

                        <Tooltip 
                            title={`${type} Reading`}
                        >
                            <Box
                                sx={{ 
                                    backgroundColor: InstrumentationType.color,
                                    color: 'white',
                                    borderRadius: 1,
                                    padding: 1,
                                    width: 35,
                                    height: 35
                                    
                                }}
                                textAlign={'center'}
                                
                                
                            >
                                <Typography margin={0} sx={{ fontWeight: "bold" }}>{InstrumentationType.label}</Typography>
                            </Box>
                        </Tooltip>
                    </Stack>
                }
            />
            <CardContent>
                <div>
                
                    <div><Box height="120px" ml="-60px">
                            <InsGraph IInstrumentationModuleProps={true}
                            staticData={["0","25","50","100"]}
                            realTime={false}
                            />
                        </Box>
                    </div>

                    <Tooltip 
                    title={`Current ${type}`}>
                        <center>
                            <Box
                                sx={{ 
                                    backgroundColor: "#419769",
                                    color: 'white',
                                    borderRadius: 1,
                                    padding: 1,
                                    width: 90,
                                    height: 35  
                                }}
                                textAlign={'center'}

                            >
                                <Typography margin={0} sx={{ fontWeight: "bold" }}>{InstrumentationType.label}</Typography>
                            </Box>
                        </center>
                    </Tooltip>
                </div>

            </CardContent>
            <CardActions>
                <div>
                    <p>Time: 0</p>
                </div>
            </CardActions>
        </Card>
    );
};
