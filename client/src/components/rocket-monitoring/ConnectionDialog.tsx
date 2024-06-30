import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSocketContext } from "../../utils/socket-context";

interface IConnectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    updateAltitude: (altitude: number) => void;
}

const ConnectionDialog: React.FC<IConnectionDialogProps> = (props: IConnectionDialogProps) => {
    const socketContext = useSocketContext();
    const [protocol, setProtocol] = useState<string>(socketContext.protocol);
    const [frequency, setFrequency] = useState<number>(socketContext.frequency);
    const [packetRetrievalFrequency, setPacketRetrievalFrequency] = useState<number>(socketContext.packetStreamingInterval);

    return(
        <Dialog open={props.isOpen}>
            <DialogTitle sx={{ fontWeight: 600 }}>Connection Status</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2} alignItems="center" sx={{ paddingTop: 1 }}>
                    <Autocomplete  
                        fullWidth
                        options={['APRS', 'LoRa' ]}
                        value={protocol}
                        renderInput={
                            (params) => 
                            <TextField 
                                {...params} 
                                label="Protocol" 
                                variant="outlined" 
                                size="small" 
                            />
                        }
                        onChange={(_: any, value: any) => {
                            setProtocol(value);
                        }}
                    />
                    <TextField 
                        fullWidth
                        required
                        value={frequency}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setFrequency(event.target.value as number);
                        }}
                        label="Frequency"
                        variant="outlined"
                        size="small"
                        type="number"
                        InputProps={{
                            endAdornment: <Typography>MHz</Typography>,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Tooltip 
                        title="How often packets are retrieved from the Telemetry server"
                    >
                        <TextField
                            fullWidth
                            required
                            value={packetRetrievalFrequency}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPacketRetrievalFrequency(event.target.value as number);
                            }}
                            label="Packet Retrieval Frequency"
                            variant="outlined"
                            size="small"
                            type="number"
                            InputProps={{
                                endAdornment: <Typography>s</Typography>,
                            }}
                        />
                    </Tooltip>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button 
                    variant={"text"} 
                    component="label" 
                    onClick={props.onClose}
                >
                    Cancel
                </Button>
                <Button 
                    variant={"contained"} 
                    component="label" 
                    disabled={!protocol || !frequency || !packetRetrievalFrequency}
                    onClick={
                        () => {
                            socketContext.updateProtocol(protocol);
                            socketContext.updateFrequency(frequency);
                            socketContext.updatePacketStreamingInterval(packetRetrievalFrequency);
                            socketContext.toggleConnection();
                            props.onClose()
                        }
                    }
                >
                    {socketContext.isConnected ? 'Disconnect' : 'Connect' }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConnectionDialog;