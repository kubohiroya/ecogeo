import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';
import {
  GeoDatabaseTable,
  getCurrentDatabaseTableType,
} from '~/app/services/database/GeoDatabaseTable';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { createProjectLink } from 'src/createProjectLink';
import dexie from 'dexie';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { GeoDatabase } from '~/app/services/database/GeoDatabase';
import { InlineIcon } from '~/components/InlineIcon/InlineIcon';
import { TypeIcons } from '~/app/pages/Home/resource/TypeIcons';
import { ProjectType } from '~/app/models/ProjectType';
import { ResourceType } from '~/app/models/ResourceType';
import { Delete } from '@mui/icons-material';

type DeleteDatabaseItemDialogProps = {
  tableType: string;
};
export const GeoDatabaseEntityDeleteDialog = ({
  tableType,
}: DeleteDatabaseItemDialogProps) => {
  const { uuid, type, name } = useLoaderData() as {
    uuid: string;
    type: ProjectType | ResourceType;
    name: string | undefined;
    description: string | undefined;
  };

  const navigate = useNavigate();

  const goHome = useCallback(() => {
    switch (tableType) {
      case GeoDatabaseTableTypes.projects:
        navigate('/projects', { replace: true });
        break;
      case GeoDatabaseTableTypes.resources:
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
    await dexie.delete(GeoDatabase.fileNameOf(tableType, uuid));
    goHome();
  }, [goHome, uuid]);

  const handleCancel = useCallback(() => {
    goHome();
  }, [goHome]);

  return (
    <Dialog open={true}>
      <DialogTitle>
        {TypeIcons[type]} Delete
        {tableType === GeoDatabaseTableTypes.projects
          ? ' project'
          : ' resource'}
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete the following item?
        </Typography>
        <Link to={createProjectLink({ uuid, type })}>{name}</Link>
      </DialogContent>
      <DialogActions>
        <Button
          variant={'outlined'}
          onClick={handleDelete}
          endIcon={<Delete />}
        >
          Delete
        </Button>
        <Button variant={'contained'} autoFocus onClick={handleCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
