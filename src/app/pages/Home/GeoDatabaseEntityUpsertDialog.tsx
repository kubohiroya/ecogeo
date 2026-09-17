import {
  Box,
  Button,
  css,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
} from '~/app/models/GeoDatabaseTableType';
import { DOCUMENT_TITLE } from '~/app/Constants';
import { ProjectType } from '~/app/models/ProjectType';
import { ResourceType } from '~/app/models/ResourceType';
import { TypeIcons } from '~/app/pages/Home/resource/TypeIcons';
import { InlineIcon } from '~/components/InlineIcon/InlineIcon';
import { Add, Edit } from '@mui/icons-material';

type UpsertDatabaseEntityDialogProps = {
  uuid: string | undefined;
  tableType: GeoDatabaseTableType;
  type: ProjectType | ResourceType;
  onSubmit: (values: {
    uuid: string | undefined;
    type: ProjectType | ResourceType;
    formData: FormData;
  }) => Promise<void>;
  children?: ReactNode;
};

export const GeoDatabaseEntityUpsertDialog = ({
  uuid,
  tableType,
  type,
  onSubmit,
  children,
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
          await onSubmit({
            uuid,
            type,
            formData,
          });
          goHome();
        },
      }}
    >
      <DialogTitle>
        <InlineIcon>{TypeIcons[type]}</InlineIcon>
        {uuid ? 'Update' : 'Create new'}{' '}
        {tableType === GeoDatabaseTableTypes.projects ? 'project' : 'resource'}
      </DialogTitle>
      <DialogContent>
        {children}
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

            <Button
              variant={'contained'}
              type="submit"
              endIcon={uuid ? <Edit /> : <Add />}
            >
              {uuid ? 'Update' : 'Create'}
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
