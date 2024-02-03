import {
  Box,
  Button,
  css,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCUMENT_TITLE } from '../../Constants';
import { ProjectTypes } from '../../services/database/ProjectType';
import { ResourceTypes } from '../../models/ResourceEntity';

type UpsertProjectDialogProps = {
  uuid: string | undefined;
  type: string;
  name: string | undefined;
  description: string | undefined;
  onSubmit: (values: {
    uuid: string | undefined;
    type: string;
    name: string;
    description: string;
  }) => Promise<void>;
};

export const UpsertDatabaseItemDialog = ({
  uuid,
  type,
  name,
  description,
  onSubmit,
}: UpsertProjectDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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

  const onCancel = () => goHome();

  useEffect(() => {
    document.title =
      DOCUMENT_TITLE + `- ${uuid ? 'Update ' : 'Create New'} ${type}`;
  }, [uuid, type]);

  return (
    <Dialog
      open={true}
      fullScreen={fullScreen}
      PaperProps={{
        component: 'form',
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const name = formJson.name;
          const description = formJson.description;
          await onSubmit({
            uuid,
            type,
            name,
            description,
          });
          goHome();
        },
      }}
    >
      <DialogTitle>
        {uuid ? 'Edit' : 'Create New'} {type} Project
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the name and description of the project.
        </DialogContentText>
        <FormControl style={{ display: 'flex' }}>
          <TextField
            name="name"
            autoComplete="off"
            defaultValue={name}
            label="Project Name"
            autoFocus
            required
            fullWidth
            margin="dense"
          />
          <TextField
            autoComplete="off"
            name={'description'}
            defaultValue={description}
            label="Project Description"
            multiline={true}
            rows={8}
            fullWidth
            margin="dense"
          />
        </FormControl>
        <DialogActions>
          <Box
            css={css`
              display: flex;
              gap: 10px;
              align-content: center;
              justify-content: center;
            `}
          >
            <Button variant={'outlined'} onClick={onCancel}>
              Cancel
            </Button>

            <Button variant={'contained'} type="submit">
              {uuid ? 'Update' : 'Create'}
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
