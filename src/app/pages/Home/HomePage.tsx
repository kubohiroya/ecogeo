import React, { useEffect } from 'react';
import GithubCorner from 'react-github-corner';
import { FullScreenBox } from '../../../components/FullScreenBox/FullScreenBox';
import AppHeader from '../../../components/AppHeader/AppHeader';
import { Share } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

export const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(
      'window.location.hash',
      window.location.pathname,
      window.location.hash,
    );
    if (window.location.hash === '' || window.location.hash === '#/') {
      navigate('/projects', { replace: true });
    }
  }, []);

  return (
    <FullScreenBox>
      <Box style={{ margin: '20px' }}>
        <GithubCorner
          href="https://github.com/kubohiroya/racetrack-economy-model"
          size={64}
        />
        <AppHeader startIcon={<Share fontSize={'large'} />}>
          Geo-Eco: Graph Structured Economy Model Simulator
        </AppHeader>
        <Outlet />
      </Box>
    </FullScreenBox>
  );
};
