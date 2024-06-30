import React, { useState, useEffect, useMemo } from 'react';
import { useSocketContext } from '../../utils/socket-context';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface IPublishMissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const PublishMissionDialog: React.FC<IPublishMissionDialogProps> = (props: IPublishMissionDialogProps) => {
    const { isOpen, onClose } = props;
    return (
        <Dialog
            open={isOpen}
            onClose={() => onClose()}
        >
            <DialogTitle>
                Publish Mission
            </DialogTitle>
            <DialogContent>
                
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
                >
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PublishMissionDialog;