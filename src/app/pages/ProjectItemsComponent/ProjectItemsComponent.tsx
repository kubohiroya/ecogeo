import React, { useEffect } from 'react';
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
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { DatabaseItemMenu } from '../DatabaseItemMenu/DatabaseItemMenu';
import { GeoDatabaseEntity } from '../../services/database/GeoDatabaseEntity';

import { createSimulatorLink } from '../../../createSimulatorLink';
import { GeoDatabaseType } from '../../services/database/GeoDatabaseType';
import SourceIcon from '@mui/icons-material/Source';

export const ProjectItemsComponent = () => {
  const { projects } = useLoaderData() as {
    projects: GeoDatabaseEntity[];
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!location.href.endsWith('/projects-new') && projects.length == 0) {
      return navigate('/projects-new');
    }
  }, []);

  const typeToIcon = {
    [GeoDatabaseType.resource]: <SourceIcon />,
    [GeoDatabaseType.realWorld]: <Public />,
    [GeoDatabaseType.graph]: <Share />,
    [GeoDatabaseType.racetrack]: <PanoramaFishEye />,
  };

  const speedDialActions = [
    {
      icon: typeToIcon[GeoDatabaseType.racetrack],
      name: GeoDatabaseType.racetrack,
      onClick: () => {
        return navigate(`/create/${GeoDatabaseType.racetrack}`);
      },
    },
    {
      icon: typeToIcon[GeoDatabaseType.graph],
      name: GeoDatabaseType.graph,
      onClick: () => {
        return navigate(`/create/${GeoDatabaseType.graph}`);
      },
    },
    {
      icon: typeToIcon[GeoDatabaseType.realWorld],
      name: GeoDatabaseType.realWorld,
      onClick: () => {
        return navigate(`/create/${GeoDatabaseType.realWorld}`);
      },
    },
  ];

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
              {projects.map((item) => (
                <TableRow key={item.uuid}>
                  <TableCell>
                    <IconButton
                      color={'primary'}
                      size={'large'}
                      onClick={() => navigate(createSimulatorLink(item))}
                    >
                      {typeToIcon[item.type]}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Link to={createSimulatorLink(item)}>{item.name}</Link>
                  </TableCell>
                  <TableCell>
                    <pre>{item.description}</pre>
                  </TableCell>
                  <TableCell>
                    <div>Created: {new Date(item.createdAt).toISOString()}</div>
                    <div>Updated: {new Date(item.updatedAt).toISOString()}</div>
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
