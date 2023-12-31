import styled from '@emotion/styled';

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
} from './model/Session';

const StyledApp = styled.div``;

export function App() {
  return (
    <StyledApp>
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
    </StyledApp>
  );
}

export default App;
