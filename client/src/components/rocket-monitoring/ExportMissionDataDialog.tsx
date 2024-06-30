import { Download } from '@mui/icons-material';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip } from '@mui/material';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';

interface IExportMissionDataDialogProps {
    isOpen: boolean;
    onClose: () => void;
    mission: any;
}

const ExportMissionDataDialog: React.FC<IExportMissionDataDialogProps> = (props: IExportMissionDataDialogProps) => {
    const { isOpen, onClose, mission } = props;
    const [extensionType, setExtensionType] = useState<any>();

    const exportData = () => {
        const blob = new Blob([JSON.stringify(mission.Data)], { type: extensionType.value });
        saveAs(blob, `${mission.Name}-data.${extensionType.label}`);
        console.log('Exporting mission data');
    }

    return (
        <Dialog
            open={isOpen}
            onClose={() => onClose()}
        >
            <DialogTitle
                sx={{fontWeight: 600 }}
            >
                Export Mission 
            </DialogTitle>
            <DialogContent>
                <Stack direction='row' spacing={2} p={1}>
                    <Autocomplete 
                        options={[
                            {
                                label: 'json',
                                value: 'application/json'
                            },
                            {
                                label: 'txt',
                                value: 'text/plain;charset=utf-8'
                            }
                        ]}
                        fullWidth
                        value={extensionType}
                        onChange={(_, value) => setExtensionType(value)}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} label='Extension Type' />}
                    />
                    <IconButton
                        onClick={exportData}
                        disabled={!extensionType}
                    >
                        <Download />
                    </IconButton>
                </Stack>

            </DialogContent>
            <DialogActions>
                <Button
                    variant='text'
                    onClick={() => onClose()}
                >
                    Cancel
                </Button>
            
                <Button
                    variant='text'
                    onClick={() => {}}
                    disabled
                >
                    Go to Mission Replay
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExportMissionDataDialog;