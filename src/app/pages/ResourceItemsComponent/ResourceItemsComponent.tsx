import React, { useEffect } from 'react';
import { Flag, LocationCity, Public, Route } from '@mui/icons-material';
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
import { ResourceEntity, ResourceTypes } from '../../models/ResourceEntity';

export const ResourceItemsComponent = () => {
  const { resources } = useLoaderData() as {
    resources: ResourceEntity[];
  };

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith('/resources') && resources.length === 0) {
      return navigate('/resources/new');
    }
  }, []);

  const speedDialActions = [
    {
      icon: <Flag />,
      name: 'GADM GeoJSON',
      onClick: () => {
        return navigate(`/resources/gadm`);
      },
    },
    {
      icon: <LocationCity />,
      name: 'IDE-GSM Cities',
      onClick: () => {
        return navigate(`/resources/cities`);
      },
    },
    {
      icon: <Route />,
      name: 'IDE-GSM Routes',
      onClick: () => {
        return navigate(`/resources/routes`);
      },
    },
  ];

  const typeToIcon = {
    [ResourceTypes.gadmShapes]: <Public />,
    [ResourceTypes.idegsmCities]: <LocationCity />,
    [ResourceTypes.idegsmRoutes]: <Route />,
  };

  return (
    <Box>
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
            {resources.map((item) => (
              <TableRow key={item.uuid}>
                <TableCell>
                  <IconButton
                    color={'primary'}
                    size={'large'}
                    onClick={() => navigate(item.url)}
                  >
                    {typeToIcon[item.type]}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Link to={item.url}>{item.name}</Link>
                </TableCell>
                <TableCell>
                  <pre>{item.description}</pre>
                </TableCell>
                <TableCell>
                  <div>
                    Updated: {new Date(item.downloadedAt).toISOString()}
                  </div>
                </TableCell>
                <TableCell>
                  <DatabaseItemMenu item={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '6px',
            paddingLeft: '170px',
          }}
        >
          <SpeedDial
            direction={'right'}
            ariaLabel="Import Resources"
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
        </div>
      </TableContainer>
    </Box>
  );
};
