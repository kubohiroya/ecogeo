import React, { ReactNode, useEffect, useState } from 'react';
import { PanoramaFishEye, Public, Share } from '@mui/icons-material';
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
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { GeoDatabaseEntityMenu } from '../GeoDatabaseEntityMenu';

import { createProjectLink } from 'src/createProjectLink';
import { ProjectTypes } from 'src/app/models/ProjectType';
import { GeoDatabaseTable } from 'src/app/services/database/GeoDatabaseTable';
import { useDocumentTitle } from '../useDocumentTitle';
import { GeoDatabaseTableTypes } from 'src/app/services/database/GeoDatabaseTableType';
import { ProjectEntity } from 'src/app/models/ProjectEntity';
import { ProjectEntitiesLoader } from './ProjectEntitiesLoader';

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
        return navigate(`/projects/create/${ProjectTypes.Racetrack}`);
      },
    },
    {
      icon: typeToIcon[ProjectTypes.Graph],
      name: ProjectTypes.Graph,
      onClick: () => {
        return navigate(`/projects/create/${ProjectTypes.Graph}`);
      },
    },
    {
      icon: typeToIcon[ProjectTypes.RealWorld],
      name: ProjectTypes.RealWorld,
      onClick: () => {
        return navigate(`/projects/create/${ProjectTypes.RealWorld}`);
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
          {projects?.map((item) => (
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
                <div>Created: {new Date(item.createdAt).toISOString()}</div>
                <div>Updated: {new Date(item.updatedAt).toISOString()}</div>
              </TableCell>
              <TableCell>
                <GeoDatabaseEntityMenu
                  item={item}
                  tableType={GeoDatabaseTableTypes.projects}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SpeedDial
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        direction="up"
        ariaLabel="Create new project"
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </TableContainer>
  );
};
