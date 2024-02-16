import {
  DialogContentText,
  FormControl,
  TextField,
  Tooltip,
} from '@mui/material';
import React, { ReactNode, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCUMENT_TITLE } from '~/app/Constants';
import { GeoDatabaseTableType } from '~/app/models/GeoDatabaseTableType';

type MapTilerDialogProps = {
  uuid: string | undefined;
  tableType: GeoDatabaseTableType;
  type: string;
  name: string | undefined;
  description: string | undefined;
  onSubmit: (values: {
    uuid: string | undefined;
    type: string;
    formData: FormData;
  }) => Promise<void>;
  children?: ReactNode;
};

export const MapTilerDialogContent = (props: MapTilerDialogProps) => {
  const navigate = useNavigate();

  const { uuid, name, description, onSubmit } = props;
  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - MapTiler API Key Configuration';
  }, []);

  const onCancel = useCallback(() => {
    navigate('/resources', { replace: true });
  }, [navigate]);

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
