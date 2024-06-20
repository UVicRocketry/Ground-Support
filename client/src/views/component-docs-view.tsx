import { useState } from "react"
import { 
	Drawer, 
	Grid, 
	Tab, 
	Tabs 
} 
from '@mui/material';
import { tabsClasses } from '@mui/material/Tabs';

import '../styles/componentDocs.css';
import ComponentDocumentation, { DocumentationProps } from "../components/ComponentDocumentation";
import { components } from '../utils/component-documentation';

// Components
import Header, { Breadcrumb } from "../components/Header";
import { ViewKeys } from "../utils/viewProviderContext";

const drawerHeight = '10vh';

export default function ComponentDocs() {
	const [ currentComponentIndex, setCurrentComponentIndex ] = useState<number>(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentComponentIndex(newValue);
		setCurrentComponent(components[newValue])
	};
    const [ currentComponent, setCurrentComponent ] = useState<DocumentationProps>(components[0]);
	const breadCrumbs: Breadcrumb[] = [
		{ name: "Ground Support", viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: false },
		{ name: "Component Docs", viewKey: ViewKeys.COMPONENT_DOCUMENT_KEY, active: true }
	];

	const colors: string[] = [
		'rgba(255, 197, 87, 1)',
		'rgba(214, 91, 79, 1)',
		'rgba(0, 94, 184, 1)',
		'rgba(69, 136, 201, 1)'
	];
	
	return(
		<div style={{ display: 'flex' }}>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'block'},
					'& .MuiDrawer-paper': { boxSizing: 'border-box', height: drawerHeight },
				}}
				anchor="bottom"
			>
				<Tabs
				  variant="scrollable"
				  scrollButtons
				  value={currentComponentIndex}
				  onChange={handleChange}
				  sx={{
					[`& .${tabsClasses.scrollButtons}`]: {
					  '&.Mui-disabled': { opacity: 0.3 },
					},
					height: "10vh"
				  }}
				>
					{components.map((component: DocumentationProps) => {
						return(
							<Tab sx={{ height: "10vh" }} label={component.Name} />
						)
					})}
				</Tabs>
			</Drawer>
			<main>
				<div style={{ width: '100vw', height: '89vh' }}>
					<Grid
						container
						direction="column"
						paddingX="2rem"
						paddingY="2rem"
						gap={3}
						sx={{ height: '100%', width: '100%' }}
					>
						{/* Page Header */}
						<Grid item>
							<Header icon="PLATFORM_HUB" breadCrumbs={breadCrumbs} />
						</Grid>

						<Grid container justifyContent="center" alignItems="center" style={{ height: '80%', overflowY: 'scroll', padding: 16 }}>
							<ComponentDocumentation  
								Name={currentComponent.Name} 
								Description={currentComponent.Description}
								Component={currentComponent.Component}
								ComponentProps={currentComponent.ComponentProps}  
								UseCase={currentComponent.UseCase}
							/>
						</Grid>
							
					</Grid>
					
					<div>
						{colors.map((color) => {
							return (
								<div
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
				</div>
			</main>
		</div>			
    );
}