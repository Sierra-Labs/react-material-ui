import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@material-ui/core';

export interface ConfirmDialogProps {
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  open: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  cancelLabel,
  confirmLabel,
  open,
  onCancel,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant='body2'>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel || 'Cancel'}</Button>
        <Button variant='contained' color='primary' onClick={onConfirm}>
          {confirmLabel || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
