import React, { useEffect } from 'react';
import { Flag, LocationCity, Route } from '@mui/icons-material';
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
import { ResourceTypes } from '../../models/ResourceEntity';
import 'dexie-observable';
import { GeoDatabaseEntity } from '../../services/database/GeoDatabaseEntity';

export const ResourceItemsComponent = () => {
  const { resources } = useLoaderData() as {
    resources: GeoDatabaseEntity[];
  };

  const navigate = useNavigate();

  console.log(
    `hash=${window.location.hash}`,
    window.location.hash.endsWith('/resources'),
    resources.length === 0,
  );

  useEffect(() => {
    if (window.location.hash.endsWith('/resources') && resources.length === 0) {
      return navigate('/resources/new');
    }
  }, [window.location.hash, navigate, resources.length]);

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
    [ResourceTypes.gadmShapes]: <Flag />,
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
              <TableCell>url</TableCell>
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
                    onClick={() => navigate(item.urls[0])}
                  >
                    {typeToIcon[item.type]}
                  </IconButton>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <pre>{item.description}</pre>
                </TableCell>
                <TableCell>
                  <ul>
                    {item.urls.map((url) => (
                      <li key={url}>
                        <Link to={url} target={'_blank'}>
                          {url}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <div>Updated: {new Date(item.updatedAt).toISOString()}</div>
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
