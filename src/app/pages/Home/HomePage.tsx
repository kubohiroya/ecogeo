import React, { useEffect } from 'react';
import { FullScreenBox } from '../../../components/FullScreenBox/FullScreenBox';
import AppHeader from '../../../components/AppHeader/AppHeader';
import { Share } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { FileDropComponent } from '../../../components/FileDropComponent/FileDropComponent';
import GithubCorner from 'react-github-corner';
import { v4 as uuid_v4 } from 'uuid';

export const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash === '' || window.location.hash === '#/') {
      navigate('/projects', { replace: true });
    }
  }, [navigate]);

  return (
    <FullScreenBox>
      <FileDropComponent
        type={'projects'}
        acceptableSuffixes={['json.zip', '.json', '.csv']}
        handleFiles={(fileList) => {
          console.log('fileList: ', fileList);
          const uuid = uuid_v4();
          //GeoDatabaseTable.getSingleton(), fileList);
        }}
        onFinish={(lastUpdated: number) => {
          console.log('finish loading: ', lastUpdated);
        }}
      >
        <AppHeader startIcon={<Share fontSize={'large'} />}>
          Eco-Geo: Graph Structured Economy Model Simulator
        </AppHeader>
        <Outlet />
      </FileDropComponent>
      <GithubCorner
        style={{ position: 'absolute', top: 0, right: 0 }}
        href="https://github.com/kubohiroya/racetrack-economy-model"
        size={64}
      />
    </FullScreenBox>
  );
};
