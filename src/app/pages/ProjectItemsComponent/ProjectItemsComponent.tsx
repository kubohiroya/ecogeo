import React, { ReactNode, useEffect } from 'react';
import { PanoramaFishEye, Public, Share } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { DatabaseItemMenu } from '../DatabaseItemMenu/DatabaseItemMenu';
import { GeoDatabaseEntity } from '../../services/database/GeoDatabaseEntity';

import { createProjectLink } from '../../../createProjectLink';
import { ProjectTypes } from '../../services/database/ProjectType';
import { DOCUMENT_TITLE } from '../../Constants';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';

export const ProjectItemsComponent = () => {
  const { projects } = useLoaderData() as {
    projects: GeoDatabaseEntity[];
  };

  //const [projectItems, setProjectItems] =
  //  React.useState<GeoDatabaseEntity[]>(projects);

  const navigate = useNavigate();

  useEffect(() => {
    if (document.location.hash.startsWith('/projects')) {
      document.title = DOCUMENT_TITLE + ` - Projects`;
    }
    if (document.location.hash.startsWith('/resource')) {
      document.title = DOCUMENT_TITLE + ` - Resources`;
    }
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.hash.endsWith('/projects') && projects.length === 0) {
      return navigate('/projects/new');
    }
  }, [location.hash, navigate, projects.length]);

  useEffect(() => {
    GeoDatabaseTable.getSingleton().on('changes', async (changes) => {
      // setProjectItems((await ResourceItemLoader(undefined)).resources);
    });
  }, []);

  const typeToIcon: Record<string, ReactNode> = {
    RealWorld: <Public />,
    Graph: <Share />,
    Racetrack: <PanoramaFishEye />,
  };

  const speedDialActions = [
    {
      icon: typeToIcon[ProjectTypes.Racetrack],
      name: ProjectTypes.Racetrack,
      onClick: () => {
        return navigate(`/create/${ProjectTypes.Racetrack}`);
      },
    },
    {
      icon: typeToIcon[ProjectTypes.Graph],
      name: ProjectTypes.Graph,
      onClick: () => {
        return navigate(`/create/${ProjectTypes.Graph}`);
      },
    },
    {
      icon: typeToIcon[ProjectTypes.RealWorld],
      name: ProjectTypes.RealWorld,
      onClick: () => {
        return navigate(`/create/${ProjectTypes.RealWorld}`);
      },
    },
  ];

  /*
  const headCells: readonly HeadCell<GeoDatabaseEntity>[] = [
    {
      id: "type",
      numeric: false,
      disablePadding: true,
      label: "type"
    },
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "name"
    },
    {
      id: "description",
      numeric: false,
      disablePadding: true,
      label: "description"
    },
    {
      id: "updatedAt",
      numeric: true,
      disablePadding: true,
      label: "updateAt"
    }
  ];
   */

  return (
    <Box>
      {projects.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>name</TableCell>
                <TableCell>description</TableCell>
                <TableCell>time</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects
                .filter((item) => item.type !== 'Resource')
                .map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      <Link to={createProjectLink(item)} target="_blank">
                        <IconButton color={'primary'} size={'large'}>
                          {typeToIcon[item.type]}
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={createProjectLink(item)} target="_blank">
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <pre>{item.description}</pre>
                    </TableCell>
                    <TableCell>
                      <div>
                        Created: {new Date(item.createdAt).toISOString()}
                      </div>
                      <div>
                        Updated: {new Date(item.updatedAt).toISOString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DatabaseItemMenu item={item} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <SpeedDial
            style={{
              justifyContent: 'center',
              margin: '6px',
              marginLeft: '120px',
            }}
            direction={'right'}
            ariaLabel="SpeedDial basic example"
            icon={<SpeedDialIcon />}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>
        </TableContainer>
      )}
    </Box>
  );
};
