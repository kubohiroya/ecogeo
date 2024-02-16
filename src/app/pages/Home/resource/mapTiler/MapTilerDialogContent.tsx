import {
  DialogContentText,
  FormControl,
  TextField,
  Tooltip,
} from '@mui/material';
import React, { useEffect } from 'react';
import { DOCUMENT_TITLE } from '~/app/Constants';

type MapTilerDialogProps = {
  name: string | undefined;
  description: string | undefined;
};

export const MapTilerDialogContent = (props: MapTilerDialogProps) => {
  const { name, description } = props;

  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - MapTiler API Key Configuration';
  }, []);

  return (
    <DialogContentText>
      Please enter your{' '}
      <a href="https://cloud.maptiler.com/account/keys/">
        MapTiler Cloud API Key
      </a>
      <FormControl style={{ display: 'flex' }}>
        <Tooltip title="Please give a new name for this resource">
          <TextField
            name="name"
            autoComplete="off"
            defaultValue={name || 'MapTiler Cloud API Key'}
            label="Name"
            required
            fullWidth
            margin="dense"
          />
        </Tooltip>
        <Tooltip title={'Please enter your MapTiler Cloud API Key'}>
          <TextField
            name="apiKey"
            autoComplete="off"
            defaultValue={name}
            label="API Key"
            autoFocus
            required
            fullWidth
            margin="dense"
          />
        </Tooltip>
        <TextField
          autoComplete="off"
          name={'description'}
          defaultValue={description}
          label="Description"
          multiline={true}
          rows={3}
          fullWidth
          margin="dense"
        />
      </FormControl>
    </DialogContentText>
  );
};
