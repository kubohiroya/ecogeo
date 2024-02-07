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
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
} from 'src/app/models/GeoDatabaseTableType';
import { DOCUMENT_TITLE } from 'src/app/Constants';

type UpsertDatabaseEntityDialogProps = {
  uuid: string | undefined;
  tableType: GeoDatabaseTableType;
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

export const GeoDatabaseEntityUpsertDialog = ({
  uuid,
  tableType,
  type,
  name,
  description,
  onSubmit,
}: UpsertDatabaseEntityDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const goHome = () => {
    switch (tableType) {
      case GeoDatabaseTableTypes.projects:
        navigate('/projects', { replace: true });
        break;
      case GeoDatabaseTableTypes.resources:
        navigate('/resources', { replace: true });
        break;
      default:
        throw new Error(`Unknown ProjectType: ${tableType}`);
    }
  };

  const onCancel = () => goHome();

  useEffect(() => {
    document.title =
      DOCUMENT_TITLE + `- ${uuid ? 'Update ' : 'Create New'} ${tableType}`;
  }, [uuid, tableType]);

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
        {uuid ? 'Edit' : 'Create New'}{' '}
        {tableType === GeoDatabaseTableTypes.projects ? 'project' : 'resource'}
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
