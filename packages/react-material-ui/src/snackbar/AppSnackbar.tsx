import React, { useState, useEffect } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

export interface AppSnackbarProps {
  severity?: 'error' | 'info' | 'success' | 'warning';
  open: boolean;
  onClose?: () => void;
}

export const AppSnackbar: React.FC<AppSnackbarProps> = props => {
  const { open, severity, children, onClose } = props;
  const [openSnackbar, setOpenSnackbar] = useState(open);
  const handleClose = () => {
    setOpenSnackbar(false);
    onClose?.();
  };
  useEffect(() => {
    setOpenSnackbar(open);
  }, [open]);
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={openSnackbar}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <MuiAlert
        severity={severity || 'info'}
        elevation={6}
        variant='filled'
        onClose={handleClose}
      >
        {children}
      </MuiAlert>
    </Snackbar>
  );
};

export default AppSnackbar;
