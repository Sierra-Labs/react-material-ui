import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@material-ui/core';

export interface ConfirmDialogProps {
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  open: boolean;
  prompt?: boolean;
  multiline?: boolean;
  placeholder?: string;
  onCancel?: () => void;
  onConfirm?: (response?: string) => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  cancelLabel,
  confirmLabel,
  open,
  prompt,
  multiline,
  placeholder,
  onCancel,
  onConfirm
}) => {
  const [response, setResponse] = useState('');
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant='body2' gutterBottom>
          {message}
        </Typography>
        {prompt && (
          <TextField
            fullWidth
            multiline={multiline}
            variant='outlined'
            placeholder={placeholder}
            value={response}
            onChange={event => setResponse(event.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel || 'Cancel'}</Button>
        <Button
          variant='contained'
          color='primary'
          disabled={prompt && response.length === 0}
          onClick={() => {
            onConfirm?.(prompt ? response : undefined);
          }}
        >
          {confirmLabel || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
