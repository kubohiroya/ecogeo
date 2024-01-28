import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { GeoDatabaseType } from '../../services/database/GeoDatabaseType';
import React, { useCallback } from 'react';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { createSimulatorLink } from '../../../createSimulatorLink';
import dexie from 'dexie';

export const DeleteDatabaseItemDialog = () => {
  const { uuid, type, name, description, coordinate, zoom } =
    useLoaderData() as {
      uuid: string;
      type: GeoDatabaseType;
      name: string | undefined;
      coordinate: [number, number];
      zoom: number;
      description: string | undefined;
    };

  const navigate = useNavigate();

  const goHome = () => {
    switch (type) {
      case GeoDatabaseType.racetrack:
      case GeoDatabaseType.graph:
      case GeoDatabaseType.realWorld:
        navigate('/projects', { replace: true });
        break;
      case GeoDatabaseType.resource:
        navigate('/resources', { replace: true });
        break;
      default:
        throw new Error(`Unknown GeoDatabaseType: ${type}`);
    }
  };

  const handleDelete = useCallback(async () => {
    await GeoDatabaseTable.getSingleton()
      .databases.where('uuid')
      .equals(uuid)
      .delete();

    await dexie.delete(uuid);
    goHome();
  }, [uuid]);

  const handleCancel = useCallback(() => {
    goHome();
  }, []);

  return (
    <Dialog open={true}>
      <DialogTitle>Delete Project Confirmation</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete the following project?
        </Typography>
        <Link to={createSimulatorLink({ uuid, type, coordinate, zoom })}>
          {name}
        </Link>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'} autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant={'outlined'} onClick={handleDelete}>
          DELETE
        </Button>
      </DialogActions>
    </Dialog>
  );
};
