import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DOCUMENT_TITLE } from '~/app/Constants';

type MapTileDialogProps = {
  name: string | undefined;
  description: string | undefined;
  mapName: string | undefined;
  apiKey: string | undefined;
};

export const MapTileDialogContent = (props: MapTileDialogProps) => {
  const { name, description, mapName: mapNameDefault, apiKey } = props;

  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - MapTiler Configuration';
  }, []);

  const mapNameOptions = [
    'backdrop',
    'basic-v2',
    'bright-v2',
    'dataviz',
    'ocean',
    'openstreetmap',
    'outdoor-v2',
    'satellite',
    'streets-v2',
    'toner-v2',
    'topo-v2',
    'winter-v2',
  ];

  const [mapName, setMapName] = useState<string>(
    mapNameDefault || mapNameOptions[0],
  );

  return (
    <Box>
      <FormControl style={{ display: 'flex' }}>
        <Tooltip title="Please give a new name for this resource">
          <TextField
            name="name"
            autoComplete="off"
            defaultValue={name}
            label="Name"
            required
            fullWidth
            margin="dense"
          />
        </Tooltip>

        <Tooltip title="Please enter the map of name by MapTiler Cloud">
          <>
            <Typography>
              Please enter the map name of{' '}
              <a href="https://cloud.maptiler.com/maps/">MapTiler Cloud Maps</a>
            </Typography>

            <Select
              id="mapName"
              value={mapName}
              onChange={(event) => setMapName(event.target.value)}
            >
              {mapNameOptions.map((mapName) => (
                <MenuItem key={mapName} value={mapName}>
                  {mapName}
                </MenuItem>
              ))}
            </Select>
          </>
        </Tooltip>

        <Tooltip title={'Please enter your MapTiler Cloud API Key'}>
          <>
            <Typography>
              Please enter your{' '}
              <a href="https://cloud.maptiler.com/account/keys/">
                MapTiler Cloud API Key
              </a>
            </Typography>
            <TextField
              name="apiKey"
              autoComplete="off"
              defaultValue={apiKey}
              label="API Key"
              required
              fullWidth
              margin="dense"
            />
          </>
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
    </Box>
  );
};
