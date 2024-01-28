import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const IdeGsmRoutesComponent = () => {
  const navigate = useNavigate();
  return (
    <Dialog open={true} fullScreen>
      <DialogTitle>
        <Typography>IDE GSM Routes</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please upload your local routes.csv files.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ margin: '10px' }}>
        <IconButton
          size="large"
          sx={{ position: 'absolute', top: '16px', right: '16px' }}
          onClick={() => {
            navigate('/resources', { replace: true });
          }}
        >
          <Close />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};
