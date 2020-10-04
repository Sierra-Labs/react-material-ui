import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@material-ui/core';

export interface AlertDialogProps {
  title: string;
  message: string;
  buttonLabels?: string[];
  open: boolean;
  onClose?: (buttonIndex: number) => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  message,
  buttonLabels,
  open,
  onClose
}) => {
  if (!buttonLabels || buttonLabels.length === 0) {
    buttonLabels = ['OK'];
  }
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (onClose) onClose(0);
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant='body2'>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {buttonLabels.map((label, index) => (
          <Button
            variant='contained'
            color='primary'
            key={index}
            onClick={() => {
              if (onClose) onClose(index);
            }}
          >
            {label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
