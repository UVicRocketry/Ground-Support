import { useEffect, useState, useCallback } from 'react';

// Components
import {
    Button,
    Grid,
    IconButton,
    Stack,
    TableCell,
    TableRow,
    Tooltip
} from '@mui/material';
import MUIDataTable, {
    ExpandButton,
    MUIDataTableExpandButton,
    MUIDataTableOptions
} from "mui-datatables";

import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Header, { Breadcrumb } from '../components/Header';

// Utils
import { IDataConfig } from '../utils/entities';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import api from '../services/api';
import ModuleEditor from '../components/dataConfigEditor/ModuleEditor';
import lodash from 'lodash';
import { ViewKeys, useViewProvider } from '../utils/viewProviderContext';
import { useActiveMission } from '../utils/ActiveMissionContext';

export default function DataConfigView() {
    const activeMissionContext = useActiveMission();
    const viewProviderContext = useViewProvider();

    const breadCrumbs: Breadcrumb[] = [
        { name: 'Ground Support', viewKey: ViewKeys.PLATFORM_SELECTION_KEY, active: false },
        { name: 'Rocket Selection', viewKey: ViewKeys.ROCKET_SELECT_KEY, active: false },
        { name: 'Rocket Details', viewKey: ViewKeys.ROCKET_DETAILS_KEY, active: false },
        { name: 'Data Configuration', viewKey: ViewKeys.DATA_CONFIG_KEY, active: true }
    ];

    const [dataConfig, setDataConfig] = useState<IDataConfig>({Modules: []} as IDataConfig);
    const [moduleEditorOpen, setModuleEditorOpen] = useState<boolean>(false)
    const [openModuleIndex, setOpenModuleIndex] = useState<number>(0)

    const getDataConfig = useCallback(async () => {
        const dataConfigResponse = await api.getDataConfig(activeMissionContext.dataConfigId || '');
        setDataConfig(dataConfigResponse.data as IDataConfig);
    }, [activeMissionContext.dataConfigId]);

    const columns = [
        {
            name: 'Module Name',
            options: { filter: false, },
        },
        {
            name: 'Field Groups',
            options: { filter: false, },
        },
        {
            name: '',
            options: { filter: false, },
        }
    ];

    interface IEditButtonsProps {
        dataConfig:IDataConfig,
        moduleIndex: number
    }

    const EditButtons = (props:IEditButtonsProps) => {

        const {dataConfig, moduleIndex} = props;

        const saveDeletion = async(payload:IDataConfig):Promise<boolean> => {
            const dataConfigID = dataConfig._id as string

            let response:any;
            try {
                response = await api.updateDataConfig(dataConfigID, payload)
                console.log(response.error)
                if (response.error) {
                    throw Error(response.status)
                }
            } catch (error) {
                console.error(error)
                return false;
            } finally {
                return true;
            }
        };

        const handleEditModule = () => {
            setOpenModuleIndex(moduleIndex);
            setModuleEditorOpen(true);
        }

        const handleClose = async() => {
            setModuleEditorOpen(false);

            // Force refresh so the user can see changes
            await getDataConfig();
        }

        const handleDeleteModule = async() => {
            let dataConfigRet:IDataConfig = lodash.cloneDeep(dataConfig)
            dataConfigRet.Modules.splice(moduleIndex, 1);
            
            let success:boolean;
            try{
                success = await saveDeletion(dataConfigRet)
                if(!success) {
                    throw Error
                }
            } catch (error) {
                console.error(error)
            } finally {
                setDataConfig(dataConfigRet)
            }
        }

        return(
            <>
                <Stack direction={"row"}>
                    <Tooltip title="Edit Module">
                        <IconButton aria-label="edit module" onClick={handleEditModule}><EditIcon/></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Module">
                        <IconButton aria-label="delete module" onClick={handleDeleteModule}><DeleteIcon/></IconButton>
                    </Tooltip>
                </Stack>
                {/* This is admittedly silly looking but is the easiest way I could think of for avoiding tons of api calls 
                    Without this short-circuit eval the editor calls the api for each module, which gets out of control 
                    quickly if we have multiple modules - also speeds up editor load time
                */}
                {moduleEditorOpen === true && openModuleIndex === moduleIndex && (
                    <ModuleEditor dataConfigID={dataConfig._id || ""} index={openModuleIndex} mode="Edit" isOpen={moduleEditorOpen} onClose={handleClose}/>
                )}
            </>
        )
    }

    const data = dataConfig.Modules.map((module, index) => {
        return [
            module.Name, 
            module.FieldGroups.length, 
            <EditButtons dataConfig={dataConfig} moduleIndex={index}/>
        ]
    });

    const options: MUIDataTableOptions = {
      filter: true,
      filterType: 'dropdown' as any,
      responsive: 'standard',
      expandableRows: true,
      expandableRowsHeader: false,
      expandableRowsOnClick: true,
      selectableRows: undefined,
      rowsExpanded: [0],

      renderExpandableRow: (rowData: string | any[], rowMeta: any) => {
        const colSpan = rowData.length + 1;
        return (
            <TableRow>
                <TableCell colSpan={colSpan}>
                    <NestedTable module={dataConfig.Modules[rowMeta.dataIndex]} />
                </TableCell>
            </TableRow>

        );
      }
    };

    const components = {
      ExpandButton: function(props: JSX.IntrinsicAttributes & MUIDataTableExpandButton) {
        if (props.dataIndex === 3 || props.dataIndex === 4) return <div style={{ width: '24px' }} />;
        return <ExpandButton {...props} />;
      },
    };

    useEffect(() => {
        getDataConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
            <div style={{width:'100vw',height:'100%'}}>   
                <Stack
                    height={'100%'}
                    padding={4}
                    direction="column"
                    gap={3}
                    overflow={'none'}
                >
                <Grid item>
                    <Header icon='ROCKET_MONITORING' breadCrumbs={breadCrumbs} />
                </Grid>

                <MUIDataTable
                    title={'Flight Computer Data Configure'}
                    data={data}
                    columns={columns}
                    options={options}
                    components={components}
                />
                <Button
                    variant="contained" 
                    color="primary" 
                    onClick={() => viewProviderContext.updateViewKey(ViewKeys.ROCKET_DETAILS_KEY)} 
                    startIcon={<NavigateBeforeIcon />}
                >
                    Back
                </Button>
            </Stack>
        </div>
        );  
    };

function NestedTable({ module }: { module: any }) {
    const fieldData = module.FieldGroups.map((fieldGroup: any) =>
        fieldGroup.Fields.map((field: any) => [
            field.Name,
            field.Units,
            JSON.stringify(field.Range),
        ])
    );

    const fieldColumns = [
        {
            name: 'Field',
            options: {
                filter: false,
                customHeadRender: () => (
                    <TableCell align="left">
                        <strong>Field</strong>
                    </TableCell>
                ),
            },
        },
        {
            name: 'Units',
            options: {
                filter: false,
                customHeadRender: () => (
                    <TableCell align="left">
                        <strong>Units</strong>
                    </TableCell>
                ),
            },
        },
        {
            name: 'Range',
            options: {
                filter: false,
                customHeadRender: () => (
                    <TableCell align="left">
                        <strong>Range</strong>
                    </TableCell>
                ),
            },
        },
    ];

    const fieldOptions: MUIDataTableOptions = {
        filter: true,
        filterType: 'dropdown',
        responsive: 'standard',
        selectableRows: undefined,
        search: false,
        download: false,
        print: false,
        viewColumns: false,
        pagination: false,
    };

    return (
        <Grid container style={{ width: '100%' }} justifyContent={'space-between'}>
            {module.FieldGroups.map((fieldGroup: any, index: number) => (
                <Grid key={index} item xs={10} sm={8} md={6} lg={4} style={{ padding: '8px' }}>
                    <MUIDataTable
                        key={index}
                        title={fieldGroup.Name}
                        data={fieldData[index]}
                        columns={fieldColumns}
                        options={fieldOptions}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
