import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { ProjectType } from '../../models/ProjectType';
import React, { useCallback } from 'react';
import { ProjectTableDB } from '../../services/projectTable/ProjectTableDB';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { createMapLink } from '../../../createMapLink';

export const DeleteDatabaseItemDialog = () => {
  const { uuid, type, name, description, coordinate, zoom } =
    useLoaderData() as {
      uuid: string;
      type: ProjectType;
      name: string | undefined;
      coordinate: [number, number];
      zoom: number;
      description: string | undefined;
    };

  const navigate = useNavigate();

  const handleOk = useCallback(async () => {
    await ProjectTableDB.getSingleton()
      .projects.where('uuid')
      .equals(uuid)
      .delete();
    navigate('/projects', { replace: true });
  }, [uuid]);

  const handleCancel = useCallback(() => {
    navigate('/projects', { replace: true });
  }, []);

  return (
    <Dialog open={true}>
      <DialogTitle>Delete Project Confirmation</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete the following project?
        </Typography>
        <Link to={createMapLink({ uuid, coordinate, zoom })}>{name}</Link>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'} autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant={'contained'} onClick={handleOk}>
          DELETE
        </Button>
      </DialogActions>
    </Dialog>
  );
};
