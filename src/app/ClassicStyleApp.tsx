import React, { Suspense } from 'react';
import { Provider } from 'jotai';
import AppHeader from '../components/AppHeader/AppHeader';
import { Share } from '@mui/icons-material';
import GithubCorner from 'react-github-corner';
import ReferenceSection from './components/ReferenceSection/ReferenceSection';
import { CircularProgress } from '@mui/material';
import SessionSelectorPanel from './components/SessionPanel/SessionSelectorPanel';
import {
  initialSelectedSessionId,
  sessionAtoms,
  sessionStateAtoms,
} from './models/Session';
import { GADMFetch } from '../components/GADMFetch/GADMFetch';
import { FileDropComponent } from '../components/FileDropComponent/FileDropComponent';
import { IndexDBConsole } from '../components/IndexDBConsole/IndexDBConsole';
import { ProjectDB } from './services/project/ProjectDB';

const onFinish = (lastUpdated: number) => {
  console.log('finish loading: ', lastUpdated);
};

export const ClassicStyleApp = ({ db }: { db: ProjectDB }) => {
  return (
    <>
      <FileDropComponent
        isDragOver={false}
        acceptableSuffixes={['.zip', '.json', '.csv']}
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
      <Provider>
        <Suspense fallback={<CircularProgress />}>
          <SessionSelectorPanel
            initialSelectedSessionId={initialSelectedSessionId}
            sessionAtoms={sessionAtoms}
            sessionStateAtoms={sessionStateAtoms}
          />
        </Suspense>
      </Provider>
      <ReferenceSection />
    </>
  );
};
