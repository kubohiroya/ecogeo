import styled from '@emotion/styled';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Typography,
} from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import { PrimitiveAtom, useAtomValue } from 'jotai';
import { SessionPanel } from './SessionPanel';
import { useImmerAtom } from 'jotai-immer';
import { rootAtom, UndoRedoSessionState } from '../../models/Root';
import { Session, sessionState } from '../../models/Session';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import {
  Add,
  Close,
  Edit,
  FileDownload,
  FileUpload,
  MoreVert,
  RestartAlt,
} from '@mui/icons-material';

const StyledTabList = styled(TabList)`
  border-radius: 10px 10px 0 0;
  background-color: #ccc;
  width: 100%;
  display: flex;
`;
const StyledTab = styled(Tab)`
  text-transform: none;
  background-color: #eee;
  box-shadow: 3px 2px 3px #aaa;
  border-bottom: 1px solid #aaa;

  padding: 0 5px 0 15px;

  &.Mui-selected {
    background-color: #fff;
    border-right: 0 none;
    border-radius: 5px 5px 0 0;
    outline-color: white;
  }

  *[aria-selected='false'] {
    background-color: #ccc;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  padding: 0;
`;

const StyledParameterBox = styled.div`
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
`;

function a11yProps(id: string) {
  return {
    id: `tab-${id}`,
    'aria-controls': `tabpanel-${id}`,
  };
}

export interface TabMenuProps {
  sessionId: string;
  sessionTitle: string;
  openRenameDialog: () => void;
}

const TabMenu = (props: TabMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenuButton = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );
  const handleCloseMenuButton = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onRenameDialogOpen = () => {
    props.openRenameDialog();
  };

  const onRevert = () => {
    alert('Reverting to default parameters...');
  };

  const onCreate = () => {};
  const onImport = () => {};
  const onExport = () => {};

  const options: Array<null | {
    label: string;
    icon: ReactElement;
    title: string;
    onClick: () => void;
    disabled?: boolean;
  }> = [
    {
      label: 'Rename ...',
      title: 'Rename the case',
      icon: <Edit />,
      onClick: onRenameDialogOpen,
    },
    {
      label: 'Revert',
      title: 'Revert parameters to the case default values',
      icon: <RestartAlt />,
      onClick: onRevert,
      disabled: true,
    },
    null,
    {
      label: 'Create',
      title: 'Create new case',
      icon: <Add />,
      onClick: onCreate,
      disabled: true,
    },
    {
      label: 'Import ...',
      title: 'Import graph structure data from a local file',
      icon: <FileUpload />,
      onClick: onImport,
      disabled: true,
    },
    {
      label: 'Export ...',
      title: 'Export graph structure data as a local file',
      icon: <FileDownload />,
      onClick: onExport,
      disabled: true,
    },
  ];

  return (
    <>
      <IconButton
        sx={{ marginLeft: 'auto' }}
        aria-label="more"
        id="long-button"
        aria-controls={openMenu ? 'long-menu' : undefined}
        aria-expanded={openMenu ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenuButton}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenuButton}
      >
        {options.map((option, index) =>
          option != null ? (
            <MenuItem
              key={option.label}
              onClick={() => {
                setAnchorEl(null);
                option.onClick();
              }}
              title={option.title}
              disabled={option.disabled}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              {option.label}
            </MenuItem>
          ) : (
            <Divider key={index} />
          ),
        )}
      </Menu>
    </>
  );
};

export function SessionSelectorPanel(props: {
  initialSelectedSessionId: string;
  sessionAtoms: Record<string, PrimitiveAtom<Session>>;
  sessionStateAtoms: Record<string, PrimitiveAtom<UndoRedoSessionState>>;
}) {
  const [sessionId, setSessionId] = useState<string | null>(
    props.initialSelectedSessionId,
  );
  const [root, setRoot] = useImmerAtom(rootAtom);
  const sessionIds = useAtomValue(root.sessionIdsAtom);
  const sessionTitles = useAtomValue(root.sessionTitlesAtom);

  const [isRenameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);

  const onSelectTab = useCallback((sessionId: string, index: number) => {
    return (event: React.SyntheticEvent) => {
      setSessionId(sessionId);
    };
  }, []);

  const onClose = useCallback(
    (sessionId: any) => {
      const index = sessionIds.indexOf(sessionId);
      const newIndex =
        sessionIds.length == 1
          ? null
          : index == sessionIds.length - 1
            ? index - 1
            : index + 1;
      const newSessionId = newIndex == null ? null : sessionIds[newIndex];
      requestAnimationFrame(() => {
        setSessionId(newSessionId);
        setRoot((draft) => {
          delete draft.sessionAtoms[sessionId];
          delete draft.sessionStateAtoms[sessionId];
        });
      });
    },
    [sessionIds, setSessionId, setRoot],
  );

  useEffect(() => {
    setRoot((draft) => {
      draft.sessionAtoms = props.sessionAtoms;
      draft.sessionStateAtoms = props.sessionStateAtoms;
    });
    setSessionId(sessionId);
  });

  return (
    <StyledParameterBox>
      {sessionIds == null || sessionIds.length == 0 || sessionId == null ? (
        <Box
          style={{
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Drag and drop your data file into here!
        </Box>
      ) : (
        <>
          <TabContext value={sessionId}>
            <StyledTabList aria-label="Case selector" scrollButtons={true}>
              {sessionIds.map((_sessionId: string, index: number) => (
                <StyledTab
                  key={_sessionId}
                  value={_sessionId}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography fontSize={'small'}>
                        {sessionTitles.get(_sessionId) || 'Untitled'}
                      </Typography>
                      <IconButton
                        size="small"
                        component="span"
                        onClick={() => onClose(_sessionId)}
                        sx={{ marginLeft: '8px' }}
                      >
                        <Close fontSize={'small'} />
                      </IconButton>
                    </span>
                  }
                  {...a11yProps(_sessionId)}
                  onClick={onSelectTab(_sessionId, index)}
                />
              ))}

              <TabMenu
                sessionId={sessionId}
                sessionTitle={sessionState.current.country.title}
                openRenameDialog={() => setRenameDialogOpen(true)}
              />
            </StyledTabList>

            {sessionIds.map((_sessionId, index) => (
              <StyledTabPanel key={_sessionId} value={_sessionId}>
                <SessionPanel
                  sessionId={_sessionId}
                  openRenameDialog={isRenameDialogOpen}
                  closeRenameDialog={() => setRenameDialogOpen(false)}
                />
              </StyledTabPanel>
            ))}
          </TabContext>
        </>
      )}
    </StyledParameterBox>
  );
}

export default SessionSelectorPanel;
