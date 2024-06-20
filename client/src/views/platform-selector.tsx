import { Box, Card, CardContent, CardHeader, Grid, Paper, Stack, Typography } from "@mui/material";
import { ViewKeys, useViewProvider } from "../utils/viewProviderContext";

import GroundSupportDarkMode from "../static/images/groundSupportDarkMode.svg";
import MonitoringSystemLogo from "../static/images/MonitoringSystemLogo.svg"
import Header, { Breadcrumb } from "../components/Header";
import { motion } from 'framer-motion';

const PlatformSelector: React.FC = () => {
    const breadCrumbs: Breadcrumb[] = [
		{ name: "Ground Support", viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: true }
	];
    const viewProviderContext = useViewProvider();
    const colors: string[] = [
		'rgba(255, 197, 87, 1)',
		'rgba(214, 91, 79, 1)',
		'rgba(0, 94, 184, 1)',
		'rgba(69, 136, 201, 1)'
	];
    return (
        <Stack padding={4} alignItems={'flex-start'} height={'100vh'}>
            <Header icon='PLATFORM_HUB' breadCrumbs={breadCrumbs} />
            <Grid 
                direction="row"
                rowGap={2}
                columnGap={5}
                container
                sx={{
                    minWidth: "100%",
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center"
                }}
                alignItems="center"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10, bounce: 0 }}
                >      
                    <Card
                        sx={{ padding: 1, cursor: "pointer" }}
                        onClick={() => {
                            viewProviderContext.updateViewKey(ViewKeys.ROCKET_SELECT_KEY)
                        }}
                    >
                        <CardHeader  
                            title={
                                <Stack direction={'row'} columnGap={1.5} alignItems="center" >
                                    <img height={40} src={GroundSupportDarkMode}/>
                                    <Typography 
                                        color="text.primary"
                                        variant="h5"
                                        fontWeight={600}
                                    >
                                        Rocket Monitoring 
                                    </Typography> 
                                </Stack>
                            }
                        />
                    </Card>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "just", stiffness: 100, damping: 10, bounce: 0 }}
                >
                    <Card 
                        sx={{ padding: 1}}
                        onClick={() => {
                            viewProviderContext.updateViewKey(ViewKeys.PDP_MONITORING_KEY)
                        }}
                    >
                        <CardHeader 
                            title={
                                <Stack direction={'row'} columnGap={1.5} alignItems="center" >
                                    <img height={40} src={MonitoringSystemLogo}/> 
                                    <Typography 
                                        color="text.primary"
                                        variant="h5"
                                        fontWeight={600}
                                    >
                                        Engine Monitoring 
                                    </Typography>
                                </Stack>
                            } 
                        />
                    </Card>
                </motion.div>
                <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
				{colors.map((color) => {
					return (
						<div
                            key={color}
							style={{
								backgroundColor: color,
								width: '25%',
								height: '1vh',
								float: 'left'
							}}
						/>
					);
				})}
			</div>
            </Grid>
        </Stack>
    );
}

export default PlatformSelector;