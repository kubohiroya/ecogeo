import React, { useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import { DOCUMENT_TITLE } from '../../../Constants';

export const IdeGsmCitiesComponent = () => {
  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - IDE GSM Cities';
  }, []);

  const navigate = useNavigate();
  return (
    <Dialog open={true} maxWidth="xl">
      <DialogTitle>
        <Typography>IDE GSM Cities</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please upload your local cities.csv files.
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
