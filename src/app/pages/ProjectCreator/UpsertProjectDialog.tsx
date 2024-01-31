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
import { ProjectType } from '../../services/database/ProjectType';
import { DOCUMENT_TITLE } from '../../Constants';

type UpsertProjectDialogProps = {
  uuid: string | undefined;
  type: ProjectType;
  name: string | undefined;
  description: string | undefined;
  onSubmit: (values: {
    uuid: string | undefined;
    type: ProjectType;
    name: string;
    description: string;
  }) => Promise<void>;
};

export const UpsertProjectDialog = ({
  uuid,
  type,
  name,
  description,
  onSubmit,
}: UpsertProjectDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const urlPrefix = type === ProjectType.resource ? '/resources' : '/projects';

  const onCancel = () => navigate(urlPrefix);

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
          navigate('/projects');
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
              Create
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
