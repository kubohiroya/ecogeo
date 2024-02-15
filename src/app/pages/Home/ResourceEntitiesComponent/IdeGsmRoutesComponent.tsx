import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import React, { useEffect } from "react";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DOCUMENT_TITLE } from "~/app/Constants";

export const IdeGsmRoutesComponent = () => {
  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - IDE GSM Routes';
  }, []);

  const navigate = useNavigate();
  return (
    <Dialog open={true} maxWidth="xl">
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
