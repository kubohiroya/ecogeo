import React from 'react';
import AppHeader from 'src/components/AppHeader/AppHeader';
import { Share } from '@mui/icons-material';
import GithubCorner from 'react-github-corner';
import ReferenceSection from './components/ReferenceSection/ReferenceSection';
import { GADMFetch } from 'src/components/GADMFetch/GADMFetch';
import { FileDropComponent } from 'src/components/FileDropComponent/FileDropComponent';
import { IndexDBConsole } from 'src/components/IndexDBConsole/IndexDBConsole';
import { GeoDatabase } from './services/database/GeoDatabase';

const onFinish = (lastUpdated: number) => {
  console.log('finish loading: ', lastUpdated);
};

export const ClassicStyleApp = ({ db }: { db: GeoDatabase }) => {
  return (
    <>
      <FileDropComponent
        type={'projects'}
        acceptableSuffixes={['.zip', '.json', '.csv']}
        handleFiles={(fileList) => {
          console.log('fileList: ', fileList);
        }}
        onFinish={onFinish}
      />
      <GADMFetch />
      <IndexDBConsole db={db} />

      <AppHeader startIcon={<Share fontSize={'large'} />}>
        Graph Structured Economy Model
      </AppHeader>

      <GithubCorner
        href="https://github.com/kubohiroya/racetrack-economy-model"
        size={64}
      />
      <ReferenceSection />
    </>
  );
};
