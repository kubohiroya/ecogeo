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

import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { TabContext, TabList } from '@mui/lab';
import {
  Add,
  Close,
  FileDownload,
  FileUpload,
  MoreVert,
  RestartAlt,
} from '@mui/icons-material';

import { enablePatches } from 'immer';
import { atom, PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
// import { sessionAtomsAtom, sessionStateAtomsAtom } from '../../model/Sessions';
import { SessionPanel } from './SessionPanel';
import {
  createSession,
  rootAtom,
  UndoRedoSessionState,
} from '../../model/Sessions';
import { INITIAL_COUNTRY_ARRAY } from '../../model/initialCountryArray';
import { useImmerAtom } from 'jotai-immer';
import { Session } from '../../model/Session';

enablePatches();

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

export interface SessionSelectorPanelProps {}

const TabMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
  }> = [
    {
      label: 'Revert',
      title: 'Revert parameters to the case default values',
      icon: <RestartAlt />,
      onClick: onRevert,
    },
    null,
    {
      label: 'Create',
      title: 'Create new case',
      icon: <Add />,
      onClick: onCreate,
    },
    {
      label: 'Import',
      title: 'Import graph structure data from a local file',
      icon: <FileUpload />,
      onClick: onImport,
    },
    {
      label: 'Export',
      title: 'Export graph structure data as a local file',
      icon: <FileDownload />,
      onClick: onExport,
    },
  ];

  return (
    <>
      <IconButton
        sx={{ marginLeft: 'auto' }}
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option, index) =>
          option != null ? (
            <MenuItem
              key={option.label}
              onClick={option.onClick}
              title={option.title}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              {option.label}
            </MenuItem>
          ) : (
            <Divider key={index} />
          )
        )}
      </Menu>
    </>
  );
};

export function SessionSelectorPanel(props: SessionSelectorPanelProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [root, setRoot] = useImmerAtom(rootAtom);
  const sessionStateMap = useAtomValue(root.sessionStateAtoms);
  const [sessionTitleArray, setSessionTitleArray] = useState<string[]>([]);
  useEffect(() => {
    const initialSessionStateArray = INITIAL_COUNTRY_ARRAY.map((country) =>
      createSession(country)
    );
    const newSessionAtoms: Record<string, PrimitiveAtom<Session>> = {};
    const newSessionStateAtoms: Record<
      string,
      PrimitiveAtom<UndoRedoSessionState>
    > = {};

    setSessionTitleArray(
      initialSessionStateArray.map((s) => s.sessionState.current.country.title)
    );
    initialSessionStateArray.forEach(({ session, sessionState }) => {
      newSessionAtoms[session.sessionId] = atom(session);
      newSessionStateAtoms[session.sessionId] = atom(sessionState);
    });

    //setSessionIds(initialSessionStateArray.map((s) => s.session.sessionId));
    setRoot((draft) => {
      draft.sessionAtoms = atom(newSessionAtoms);
      draft.sessionStateAtoms = atom(newSessionStateAtoms);
    });
    setSessionId(
      initialSessionStateArray[initialSessionStateArray.length - 1].session
        .sessionId
    );
  }, []);

  const onSelectTab = useCallback(
    (sessionId: string) => {
      return (event: React.SyntheticEvent) => {
        setSessionId(sessionId);
      };
    },
    [setSessionId]
  );

  const onClose = useCallback(
    (sessionId: any) => {
      setRoot((draft) => {
        delete useAtom(draft.sessionAtoms)[sessionId];
        delete useAtom(draft.sessionStateAtoms)[sessionId];
      });
    },
    [root.sessionAtoms, root.sessionStateAtoms]
  );

  const sessionIds = [...Object.keys(sessionStateMap)];

  return (
    <StyledParameterBox>
      {sessionId == null ? (
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
                  key={sessionIds[index]}
                  value={sessionIds[index]}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <Typography fontSize={'small'}>
                        {sessionTitleArray[index]}
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
                  onClick={onSelectTab(_sessionId)}
                />
              ))}

              <TabMenu />
            </StyledTabList>

            {sessionIds.map((_sessionId, index) => (
              <StyledTabPanel key={_sessionId} value={_sessionId}>
                {_sessionId === sessionId && (
                  <SessionPanel sessionId={_sessionId} />
                )}
              </StyledTabPanel>
            ))}
          </TabContext>
        </>
      )}
    </StyledParameterBox>
  );
}

export default SessionSelectorPanel;
