import React, {useState} from "react";
import { Button, Dialog, TextField, Stack, DialogContent, Typography } from "@mui/material";

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void
}

const SettingsDialog: React.FC<SettingsDialogProps> = (props: SettingsDialogProps) => {

    const [isOpen, setIsOpen] = useState(props.isOpen);

    return(
        <Dialog open={props.isOpen}>
            <DialogContent>
                <Stack direction="column" spacing={2} alignItems="center">

                    {/* Doesn't save Mission Name anywhere yet. */}
                    <Stack direction="row" spacing={2} alignItems="center">

                        <Typography variant="h5"> Mission Name: </Typography>

                        <TextField variant="outlined" size="small" type="String"/>

                    </Stack>

                    {/* Doesn't store the uploaded file yet, just opens file explorer and lets a file be picked. */}
                    <Button variant={"contained"} component="label">
                        Upload
                        <input hidden accept="text/txt" type="file" />
                    </Button>

                    <Stack direction="row" spacing={2} alignItems="center">

                        {/* These buttons are identical for now; need to add functionality to Save Changes. Closing without saving shouldn't change any configs or the mission name */}
                        <Button variant={"contained"} component="label" onClick={props.onClose}>
                            Save Changes
                        </Button>

                        <Button variant={"contained"} component="label" onClick={props.onClose}>
                            Close
                        </Button>

                    </Stack>
                    

                </Stack>
            </DialogContent>

        </Dialog>
    );
}

export default SettingsDialog;