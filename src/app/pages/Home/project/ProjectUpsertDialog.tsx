import { useGeolocated } from 'react-geolocated';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import React, { useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';
import { INITIAL_VIEW_STATE } from '~/app/Constants';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { DialogContent, FormControl, TextField } from '@mui/material';
import { GeoDatabaseEntityUpsertDialog } from '~/app/pages/Home/GeoDatabaseEntityUpsertDialog';

export const ProjectUpsertDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: string;
    name: string | undefined;
    description: string | undefined;
  };

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const { latitude, longitude, zoom } = {
    latitude: coords?.latitude || INITIAL_VIEW_STATE.latitude,
    longitude: coords?.longitude || INITIAL_VIEW_STATE.longitude,
    zoom: INITIAL_VIEW_STATE.zoom,
  };

  const onSubmit = useCallback(
    async (values: {
      uuid: string | undefined;
      type: string;
      formData: FormData;
    }) => {
      const formJson = Object.fromEntries(
        (values.formData as any).entries(),
      ) as {
        name: string;
        description: string;
        coordinates: [number, number];
        zoom: number;
      };

      if (!uuid) {
        const viewportCenter: [number, number, number] =
          type === 'RealWorld' ? [zoom, latitude, longitude] : [1, 0, 0];

        //const name = formJson.name;
        //const description = formJson.description;

        await GeoDatabaseTable.createProject({
          ...formJson,
          type,
          viewportCenter,
          version: 1,
          createdAt: Date.now(),
        });
      } else {
        await GeoDatabaseTable.updateProject(uuid, {
          ...formJson,
        });
      }
    },
    [latitude, longitude, type, uuid, zoom],
  );

  return (
    <GeoDatabaseEntityUpsertDialog
      uuid={uuid}
      tableType={GeoDatabaseTableTypes.projects}
      type={type}
      onSubmit={onSubmit}
    >
      <DialogContent>
        Please enter the name and description of the project.
        <FormControl style={{ display: 'flex' }}>
          <TextField
            name="name"
            autoComplete="off"
            defaultValue={name}
            label="Name"
            autoFocus
            required
            fullWidth
            margin="dense"
          />
          <TextField
            autoComplete="off"
            name={'description'}
            defaultValue={description}
            label="Description"
            multiline={true}
            rows={8}
            fullWidth
            margin="dense"
          />
        </FormControl>
      </DialogContent>
    </GeoDatabaseEntityUpsertDialog>
  );
};
