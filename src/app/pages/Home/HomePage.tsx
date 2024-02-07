import React, { useEffect } from 'react';
import { FullScreenBox } from 'src/components/FullScreenBox/FullScreenBox';
import AppHeader from 'src/components/AppHeader/AppHeader';
import { Share } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import GithubCorner from 'react-github-corner';
import { FileDropComponent } from 'src/app/components/FileDropComponent/FileDropComponent';

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
          /*
          const uuid = uuid_v4();
          storeGeoRegions({
            fileList,
            uuid,
            type: 'projects',
          });
           */
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
