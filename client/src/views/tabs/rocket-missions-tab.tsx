import React, { useCallback, useEffect, useState } from 'react';
import { IMission, IRocketPopulated } from '../../utils/entities';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumnOptions } from 'mui-datatables';
import { useActiveMission } from '../../utils/ActiveMissionContext';
import { ViewKeys, useViewProvider } from '../../utils/viewProviderContext';
import { Alert, Chip, Icon, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank, ShowChart, Height, HorizontalRule, Edit, DateRange } from '@mui/icons-material';
import MissionConfig from '../../components/MissionConfig';
import { saveAs } from 'file-saver';
import ExportMissionDataDialog from '../../components/rocket-monitoring/ExportMissionDataDialog';

interface FormattedMissionData {
    _id?: string;
    Name: string;
    Date: Date;
    IsTest: boolean;
    Longitude: number;
    Latitude: number;
    LaunchAltitude: Number;
    Published: boolean;
    Components: string[];
    Data?: any;
}

interface ITableColumns {
    name: string;
    label: string;
    options: MUIDataTableColumnOptions
}

interface Props {
    rocket: IRocketPopulated;
    onMissionClick: (mission: any) => void;
}

const RocketDetailsTab: React.FC<Props> = (props: Props) => {
    const { rocket, onMissionClick } = props;
    const [ missions, setMissions ] = useState<FormattedMissionData[]>([]);
    const [ selectedMissionId, setSelectedMissionId ] = useState<string | null>(null);
    const [missionEditDialog, setMissionEditDialog] = useState<boolean>(false);
    const [tableWarning, setTableWarning] = useState<boolean>(true);
    const [exportMissionDataDialog, setExportMissionDataDialog] = useState<boolean>(false);
    const [selectedMission, setSelectedMission] = useState<FormattedMissionData | null>(null)
    const viewProviderContext = useViewProvider();
    const activeMissionContext = useActiveMission();

    const exportMissionData = (mission: FormattedMissionData) => {
        if (mission.Data && mission.Published) {
            setExportMissionDataDialog(true);
        }
    }

    const getMissions = useCallback(async () => {
        rocket.Missions.map(async (mission: IMission) => {
            const m: FormattedMissionData = {
                _id: mission._id,
                Name: mission.Name,
                Date: mission.Date,
                IsTest: mission.IsTest,
                Longitude: mission.Coordinates.Longitude,
                Latitude: mission.Coordinates.Latitude,
                LaunchAltitude: mission.LaunchAltitude,
                Published: mission.Published,
                Components: mission.Components,
                Data: mission.Data,
            };
            if (missions.length === 0) {
                missions.push(m);
            }
            setMissions((prev) => [...prev, m]);
        });
    }, [missions, rocket.Missions]);

    useEffect(() => {
        setMissions([]);
        getMissions();
    }, []);
    

    const options: MUIDataTableOptions = {
        filter: true,
        responsive: 'standard',
        onCellClick: (_, cellMeta) => {
            if (cellMeta.colIndex === 0) {
                return;
            }
            setSelectedMission(missions[cellMeta.dataIndex])
            activeMissionContext.updateMission(rocket.Missions[cellMeta.dataIndex]);
            activeMissionContext.updateRocket(rocket);
            if (rocket.Missions[cellMeta.dataIndex].Published) {
                exportMissionData(missions[cellMeta.dataIndex]);
                // TODO: uncomment when view is completed
                // viewProviderContext.updateViewKey(ViewKeys.MISSION_REPLAY_KEY);
            } else {
                viewProviderContext.updateViewKey(ViewKeys.ACTIVE_FLIGHT_KEY)
            }
        }
    };
    
    const columns: ITableColumns[] = [
        {
            name: "Edit",
            label: "Edit",
            options: {
                filter: false,
                sort: false,
                viewColumns: true,
                customBodyRender(value, tableMeta, updateValue) {
                    return (
                        <IconButton
                            onClick={
                                () => {
                                    setSelectedMissionId(missions[tableMeta.rowIndex]._id as string);
                                    setMissionEditDialog(true);
                                }
                            }
                            sx={{
                                zIndex: 10,
                            }}
                        >
                            <Edit />
                        </IconButton>
                    )
                }
            },
        },
        {
            name: "Name",
            label: "Name",
            options: {
                filter: true,
                sort: true,
                viewColumns: true,
                customBodyRender(value) {
                    return (
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                            }}
                        >
                            {value}
                        </Typography>
                    )
                }
            },
        },
        {
            label: "Launch Date",
            name: "Date",
            options: {
                filter: true,
                sort: true,
                viewColumns: true,
                customBodyRender(value) {
                    return (
                        <Chip
                            icon={<DateRange />}
                            label={new Date(value).toDateString()}
                            color="default"
                            sx={{
                                borderRadius: 2,
                            }}
                        />
                    )
                },
            }
        },
        {
            label: "Mission Type",
            name: "IsTest",
            options: {
                filter: true,
                sort: true,
                viewColumns: true,
                customBodyRender(value) {
                    console.log(value);
                    return (
                        <Chip
                            label={value ? "Test" : "Mission"}
                            color={value ? "warning" : "primary"}
                            sx={{
                                borderRadius: 2,
                            }}
                        />
                    )
                },
            }
        },
        {
            label: "Launch Latitude",
            name: "Latitude",
            options: {
                filter: true,
                sort: true,
                viewColumns: true,
                customBodyRender(value) {
                    return (
                        <Stack direction={'row'}>
                            <Height /> 
                            <Typography >{value}</Typography>
                        </Stack>
                    );
                }
            }
        },
        {
            label: "Launch Longitude",
            name: "Longitude",
            options: {
                filter: true,
                sort: true,
                viewColumns: true,
                customBodyRender(value) {
                    return (
                        <Stack direction={'row'} spacing={1}>
                            <HorizontalRule /> 
                            <Typography >{value}</Typography>
                        </Stack>
                    );
                }
            }
        },
        {
            label: "Launch Altitude",
            name: "LaunchAltitude",
            options: {
                filter: true,
                sort: true,
                viewColumns: true,
                customBodyRender(value) {
                    return (
                        <Stack direction={'row'} spacing={1}>
                            <ShowChart /> 
                            <Typography >{value}</Typography>
                        </Stack>
                    );
                }
            }
        },
        {
            name: "Published",
            label: "Published",
            options: {
                filter: true,
                sort: true,
                viewColumns: true,
                customBodyRender(value) {
                    return value ? (<CheckBox color='success' />) : (<CheckBoxOutlineBlank color='grey' />);                  
                }
            }
        },
    ];

    return (
        <>
            <Snackbar
                open={tableWarning}
                autoHideDuration={4000}
                onClose={() => setTableWarning(false)}
            >
                <Alert severity="warning">
                    To update mission table you have to go back to rocket select or refresh the page.
                </Alert>
            </Snackbar>
            <MUIDataTable
                title={"Missions"}
                options={options}
                columns={columns}
                data={missions}
            />
            <MissionConfig
                missionId={selectedMissionId as string}
                rocket={rocket}
                isOpen={missionEditDialog}
                onClose={() => setMissionEditDialog(false)}
                onSave={() => {}}
            />
            <ExportMissionDataDialog 
                isOpen={exportMissionDataDialog}
                onClose={() => setExportMissionDataDialog(false)}
                mission={selectedMission as FormattedMissionData}
            />
        </>
    );
};

export default RocketDetailsTab;
