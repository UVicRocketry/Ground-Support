import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Stack, Link } from "@mui/material";
import groundSupport from "../static/images/groundSupport.svg";

export interface Breadcrumb {
    name: string;
    path: string;
    active: boolean;
};

interface HeaderProps {
    view: string;
    breadCrumbs: Breadcrumb[];
};

const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
};

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
    const crumbs = props.breadCrumbs.map((crumb: Breadcrumb) => {
        if (!crumb.active) {
            return (
                <Link
                    underline="hover"
                    color="inherit"
                    href={ crumb.path }
                >
                    { crumb.name }
                </Link>
            );
        } else {
            return (
                <Typography 
                    color="text.primary"
                >
                    { crumb.name }
                </Typography>
            );
        }    
    });

    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start" 
        >
            <img src={groundSupport} alt="Ground Support Icon" height={100}/>
            <Stack
                direction="column"
                alignItems="flex-start" 
                spacing={1}
            >
                <Typography variant="h2" sx={{ fontWeight: 'medium' }}>Ground Support</Typography>
                <Breadcrumbs>
                    { crumbs }
                </Breadcrumbs>
            </Stack>
        </Stack>
    );
};

export default Header;