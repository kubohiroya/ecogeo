import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { DOCUMENT_TITLE } from "~/app/Constants";

export const GeoJsonComponent = () => {
  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - IDE GSM Cities';
  }, []);

  const navigate = useNavigate();
  return (
    <Dialog open={true} maxWidth="xl">
      <DialogTitle>
        <Typography>GeoJSON file</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please upload your local GeoJSON json files.
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
