import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';
import {
  GeoDatabaseTable,
  getCurrentDatabaseTableType,
} from '../../services/database/GeoDatabaseTable';
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
import { DatabaseTableTypes } from '../../services/database/GeoDatabaseTableType';

type DeleteDatabaseItemDialogProps = {
  tableType: string;
};
export const DeleteDatabaseItemDialog = ({
  tableType,
}: DeleteDatabaseItemDialogProps) => {
  const { uuid, type, name } = useLoaderData() as {
    uuid: string;
    type: string;
    name: string | undefined;
    description: string | undefined;
  };

  const navigate = useNavigate();

  const goHome = useCallback(() => {
    switch (tableType) {
      case DatabaseTableTypes.projects:
        navigate('/projects', { replace: true });
        break;
      case DatabaseTableTypes.resources:
        navigate('/resources', { replace: true });
        break;
      default:
        throw new Error(`Unknown Type: ${tableType}`);
    }
  }, [navigate, tableType]);

  const handleDelete = useCallback(async () => {
    await GeoDatabaseTable.getTableByTableType(getCurrentDatabaseTableType())
      .where('uuid')
      .equals(uuid)
      .delete();
    await dexie.delete(uuid);
    goHome();
  }, [goHome, uuid]);

  const handleCancel = useCallback(() => {
    goHome();
  }, [goHome]);

  return (
    <Dialog open={true}>
      <DialogTitle>
        Delete
        {tableType === DatabaseTableTypes.projects ? ' project' : ' resource'}
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete the following item?
        </Typography>
        <Link to={createProjectLink({ uuid, type })}>{name}</Link>
      </DialogContent>
      <DialogActions>
        <Button variant={'contained'} autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant={'outlined'} onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
