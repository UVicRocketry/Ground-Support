import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Stack, Link, useTheme } from "@mui/material";

// Logos
import GroundSupport from "../static/images/groundSupportDarkMode.svg";
import EngineMonitoringSystem from "../static/images/MonitoringSystemLogo.svg"
import PlatformHub from "../static/images/PlatformHubLogo.png";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ViewKeys, useViewProvider } from "../utils/viewProviderContext";

export interface Breadcrumb {
    name: string;
    viewKey: ViewKeys;
    active: boolean;
};

interface HeaderProps {
    breadCrumbs: Breadcrumb[];
    icon: "ROCKET_MONITORING" | "ENGINE_MONITORING" | "PLATFORM_HUB"
};

const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
};

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
    const viewProviderContext = useViewProvider();
    const crumbs = props.breadCrumbs.map((crumb: Breadcrumb) => {
        if (!crumb.active) {
            return (
                <Link
                    key={crumb.name} 
                    sx={{ cursor: 'pointer' }}
                    underline="hover"
                    color="inherit"
                    variant="h5"
                    fontWeight={600}
                    onClick={() => {
                        viewProviderContext.updateViewKey(crumb.viewKey);
                    }}
                >
                    { crumb.name }
                </Link>
            );
        } else {
            return (
                <Typography
                    key={crumb.name} 
                    color="text.primary"
                    variant="h5"
                    fontWeight={600}
                >
                    { crumb.name }
                </Typography>
            );
        }    
    });

    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center" 
        >
            <img 
                src={props.icon == "PLATFORM_HUB" 
                    ? PlatformHub 
                    : props.icon == "ENGINE_MONITORING"
                        ? EngineMonitoringSystem
                        : GroundSupport} 
                alt="Icon" 
                height={45} 
                onClick={() => viewProviderContext.updateViewKey(ViewKeys.PLATFORM_SELECTION_KEY)}
            />
            <Breadcrumbs 
                onClick={handleClick}
                separator={<NavigateNextIcon fontSize="small" />}
            >
                { crumbs }
            </Breadcrumbs>
        </Stack>
    );
};

export default Header;