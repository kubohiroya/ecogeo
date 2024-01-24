import React, { useEffect } from 'react';
import GithubCorner from 'react-github-corner';
import { FullScreenBox } from '../../../components/FullScreenBox/FullScreenBox';
import { FileDropComponent } from '../../../components/FileDropComponent/FileDropComponent';
import AppHeader from '../../../components/AppHeader/AppHeader';
import { Quiz, Share } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname == '/') {
      navigate('/resources', { replace: true });
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

        <Tooltip
          title={
            'resource files(GADM Shapes GeoJSON files, IDE-GSM cities and routes csv files) and project files'
          }
        >
          <Typography style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Otherwise, drag and drop your local files
            <Quiz
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                margin: '3px',
              }}
            />
          </Typography>
        </Tooltip>
      </FileDropComponent>
    </FullScreenBox>
  );
};
