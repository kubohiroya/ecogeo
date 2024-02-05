import React, { useEffect, useState } from 'react';
import { Flag, LocationCity, Route } from '@mui/icons-material';
import {
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
import { useLoaderData, useNavigate } from 'react-router-dom';
import { DatabaseItemMenu } from '../DatabaseItemMenu/DatabaseItemMenu';
import { ResourceTypes } from '../../models/ResourceType';
import 'dexie-observable';
import { ResourceEntity } from '../../models/ResourceEntity';
import { GADMGeoJsonComponent } from './GADMGeoJsonComponent';
import { useDocumentTitle } from '../Home/useDocumentTitle';
import { DatabaseTableTypes } from '../../services/database/GeoDatabaseTableType';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { ResourceEntitiesLoader } from './ResourceEntitiesLoader';
import styled from '@emotion/styled';

const Cell = styled(TableCell)`
  display: block;
  max-height: 180px;
  padding-top: 8px;
  padding-bottom: 8px;
  overflow-y: auto;
  border: none;
  background-color: '#ccc';
`;
const Row = styled(TableRow)`
  height: 80px;
  border-bottom: solid #ccc 0.5px;
`;

export const ResourceEntitiesComponent = () => {
  const { resources: initialResources } = useLoaderData() as {
    resources: ResourceEntity[];
  };
  const [resources, setResources] =
    useState<ResourceEntity[]>(initialResources);
  const navigate = useNavigate();

  const updateResources = () => {
    ResourceEntitiesLoader({}).then((resources) => setResources(resources));
  };

  useEffect(() => {
    if (
      window.location.hash.endsWith('/resources') &&
      resources?.length === 0
    ) {
      return navigate('/resources/new');
    }
  }, [navigate, resources?.length]);

  useEffect(() => {
    updateResources();
  }, []);

  useEffect(() => {
    GeoDatabaseTable.getSingleton().on('changes', async (changes) => {
      if (changes.some((change) => change.table === 'resources')) {
        updateResources();
      }
    });
  }, []);

  useDocumentTitle();

  const speedDialActions = [
    {
      icon: <Flag />,
      name: 'GADM GeoJSON',
      onClick: () => {
        return navigate(`/resources/create/gadm`);
      },
    },
    {
      icon: <LocationCity />,
      name: 'IDE-GSM Cities',
      onClick: () => {
        return navigate(`/resources/create/cities`);
      },
    },
    {
      icon: <Route />,
      name: 'IDE-GSM Routes',
      onClick: () => {
        return navigate(`/resources/create/routes`);
      },
    },
  ];

  const typeToIcon = {
    [ResourceTypes.gadmShapes]: <Flag />,
    [ResourceTypes.idegsmCities]: <LocationCity />,
    [ResourceTypes.idegsmRoutes]: <Route />,
  };

  return (
    <TableContainer
      component={Paper}
      style={{ overflow: 'scroll', height: 'calc(100vh - 150px)' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>name</TableCell>
            <TableCell>description</TableCell>
            <TableCell>contents</TableCell>
            <TableCell>time</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources?.map((resource, resourceIndex) => (
            <Row key={resource.uuid}>
              <TableCell>
                <IconButton color={'primary'} size={'large'} onClick={() => {}}>
                  {typeToIcon[resource.type]}
                </IconButton>
              </TableCell>
              <TableCell>{resource.name}</TableCell>
              <Cell>{resource.description}</Cell>
              <Cell>
                {resource.type === 'gadmShapes' ? (
                  <GADMGeoJsonComponent
                    key={resourceIndex}
                    resource={resource}
                  />
                ) : (
                  <></>
                )}
              </Cell>
              <TableCell>
                <div>Updated: {new Date(resource.updatedAt).toISOString()}</div>
              </TableCell>
              <TableCell>
                <DatabaseItemMenu
                  item={resource}
                  tableType={DatabaseTableTypes.resources}
                />
              </TableCell>
            </Row>
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
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}
          direction="up"
          ariaLabel="Create new resource"
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
  );
};
