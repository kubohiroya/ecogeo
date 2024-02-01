import { Link, useLoaderData, useNavigate } from 'react-router-dom';
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
import { createProjectLink } from '../../../createProjectLink';
import dexie from 'dexie';
import { ProjectTypes } from '../../services/database/ProjectType';
import { ResourceTypes } from '../../models/ResourceEntity';

export const DeleteDatabaseItemDialog = () => {
  const { uuid, type, name, viewportCenter } = useLoaderData() as {
    uuid: string;
    type: string;
    name: string | undefined;
    viewportCenter: [number, number, number];
    description: string | undefined;
  };

  const navigate = useNavigate();

  const goHome = () => {
    switch (type) {
      case ProjectTypes.Racetrack:
      case ProjectTypes.Graph:
      case ProjectTypes.RealWorld:
        navigate('/projects', { replace: true });
        break;
      case ResourceTypes.gadmShapes:
      case ResourceTypes.idegsmCities:
      case ResourceTypes.idegsmRoutes:
        navigate('/resources', { replace: true });
        break;
      default:
        throw new Error(`Unknown ProjectType: ${type}`);
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
        <Link to={createProjectLink({ uuid, type, viewportCenter })}>
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
