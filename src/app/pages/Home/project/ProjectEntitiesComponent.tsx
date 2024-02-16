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
} from '@mui/material';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { GeoDatabaseEntityMenu } from '../GeoDatabaseEntityMenu';

import { createProjectLink } from 'src/createProjectLink';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { useDocumentTitle } from '../useDocumentTitle';
import { ProjectEntity } from '~/app/models/ProjectEntity';
import { ProjectEntitiesLoader } from './ProjectEntitiesLoader';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { ProjectTypeIcons } from '~/app/pages/Home/project/ProjectTypeIcons';
import { ProjectTypeSpeedDial } from '~/app/pages/Home/project/ProjectTypeSpeedDial';

export const ProjectEntitiesComponent = () => {
  const initialProjectEntities: ProjectEntity[] =
    useLoaderData() as ProjectEntity[];
  const [projects, setProjects] = useState<ProjectEntity[]>(
    initialProjectEntities,
  );
  const navigate = useNavigate();

  const updateProjects = () => {
    ProjectEntitiesLoader({}).then((projects) => setProjects(projects));
  };

  useEffect(() => {
    updateProjects();
  }, []);

  useEffect(() => {
    GeoDatabaseTable.getSingleton().on('changes', async (changes) => {
      if (changes.some((change) => change.table === 'projects')) {
        updateProjects();
      }
    });
  }, []);

  useEffect(() => {
    if (window.location.hash.endsWith('/projects') && projects.length === 0) {
      return navigate('/projects/new');
    }
  }, [navigate, projects?.length]);

  useDocumentTitle();

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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>name</TableCell>
            <TableCell>description</TableCell>
            <TableCell>last updated</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects?.map((project) => (
            <TableRow key={project.uuid}>
              <TableCell>
                <Link to={createProjectLink(project)} target="_blank">
                  <IconButton color={'primary'} size={'large'}>
                    {ProjectTypeIcons[project.type]}
                  </IconButton>
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  to={createProjectLink(project)}
                  target="_blank"
                  title={project.uuid}
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>
                <pre>{project.description}</pre>
              </TableCell>
              <TableCell>
                <div>{new Date(project.updatedAt).toISOString()}</div>
              </TableCell>
              <TableCell>
                <GeoDatabaseEntityMenu
                  item={project}
                  tableType={GeoDatabaseTableTypes.projects}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProjectTypeSpeedDial />
    </TableContainer>
  );
};
