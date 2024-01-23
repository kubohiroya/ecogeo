import React, { useEffect } from 'react';
import { PsychologyAlt, Public, Share } from '@mui/icons-material';
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
import { Link, Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { FileDropComponent } from '../../../components/FileDropComponent/FileDropComponent';
import { FullScreenBox } from '../../../components/FullScreenBox/FullScreenBox';
import { ProjectMenu } from './ProjectMenu';
import GithubCorner from 'react-github-corner';
import AppHeader from '../../../components/AppHeader/AppHeader';
import { ProjectEntity } from '../../services/projectTable/ProjectEntity';

import { createMapLink } from '../../../createMapLink';
import { ProjectType } from './ProjectType';

export const ProjectIndexPage = () => {
  const { projects } = useLoaderData() as {
    projects: ProjectEntity[];
  };

  const navigate = useNavigate();
  const speedDialActions = [
    {
      icon: <PsychologyAlt />,
      name: 'theoretical',
      onClick: () => {
        return navigate(`/create/${ProjectType.theoretical}`);
      },
    },
    {
      icon: <Public />,
      name: 'realworld',
      onClick: () => {
        return navigate(`/create/${ProjectType.realWorld}`);
      },
    },
  ];

  useEffect(() => {
    if (!location.href.endsWith('/create') && projects.length == 0) {
      return navigate('/create');
    }
  }, []);

  return (
    <FullScreenBox>
      <GithubCorner
        href="https://github.com/kubohiroya/racetrack-economy-model"
        size={64}
      />
      <FileDropComponent
        isDragOver={false}
        acceptableSuffixes={['.zip', '.json', '.csv']}
      >
        <AppHeader startIcon={<Share fontSize={'large'} />}>
          Geo-Eco: Graph Structured Economy Model Simulator
        </AppHeader>

        <Outlet />

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
                          onClick={() => navigate(createMapLink(item))}
                        >
                          {item.type === ProjectType.realWorld ? (
                            <Public />
                          ) : (
                            <PsychologyAlt />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Link to={`/update/${item.type}/${item.uuid}`}>
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
                        <ProjectMenu item={item} />
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
      </FileDropComponent>
    </FullScreenBox>
  );
};
