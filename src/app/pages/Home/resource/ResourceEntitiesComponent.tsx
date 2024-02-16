import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { GeoDatabaseEntityMenu } from '../GeoDatabaseEntityMenu';
import 'dexie-observable';
import { ResourceEntity } from '~/app/models/ResourceEntity';
import { GADMGeoJsonComponent } from './gadm/GADMGeoJsonComponent';
import { useDocumentTitle } from '../useDocumentTitle';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { ResourceEntitiesLoader } from './ResourceEntitiesLoader';
import { Cell } from '../Styles';
import { resourceTypeIcons } from '~/app/pages/Home/resource/ResourceTypeIcons';
import { ResourceTypeSpeedDial } from '~/app/pages/Home/resource/ResourceTypeSpeedDial';

export const ResourceEntitiesComponent = () => {
  const { resources: initialResources } = useLoaderData() as {
    resources: ResourceEntity[];
  };
  const [resources, setResources] =
    useState<ResourceEntity[]>(initialResources);
  const navigate = useNavigate();

  const updateResources = () => {
    ResourceEntitiesLoader({}).then((resources: ResourceEntity[]) =>
      setResources(resources),
    );
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

  return (
    <TableContainer
      component={Paper}
      style={{ overflow: 'scroll', maxHeight: 'calc(100vh - 150px)' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>name</TableCell>
            <TableCell>description</TableCell>
            <TableCell>contents</TableCell>
            <TableCell>last updated</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources?.map((resource, resourceIndex) => (
            <TableRow key={resource.uuid}>
              <TableCell>
                <IconButton color={'primary'} size={'large'} onClick={() => {}}>
                  {resourceTypeIcons[resource.type]}
                </IconButton>
              </TableCell>
              <TableCell>
                <Tooltip title={resource.uuid}>
                  <Typography>{resource.name}</Typography>
                </Tooltip>
              </TableCell>
              <TableCell>{resource.description}</TableCell>
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
                <div>{new Date(resource.updatedAt).toISOString()}</div>
              </TableCell>
              <TableCell>
                <GeoDatabaseEntityMenu
                  item={resource}
                  tableType={GeoDatabaseTableTypes.resources}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ResourceTypeSpeedDial />
    </TableContainer>
  );
};
