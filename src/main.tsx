import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RealWorldSimPage } from './app/pages/RealWorldSim/RealWorldSimPage';
import { GeoDatabase } from './app/services/database/GeoDatabase';
import { GeoDatabaseItemCreateModeSelector } from './app/pages/Home/GeoDatabaseItemCreateModeSelector';
import { UpsertTheoreticalProjectDialog } from './app/pages/ProjectCreator/UpsertTheoreticalProjectDialog';
import { createProjectLoader } from './app/pages/ProjectCreator/createProjectLoader';
import { UpsertGeoProjectDialog } from './app/pages/ProjectCreator/UpsertGeoProjectDialog';
import { GeoDatabaseType } from './app/services/database/GeoDatabaseType';
import { DeleteDatabaseItemDialog } from './app/pages/DatabaseItemMenu/DeleteDatabaseItemDialog';
import { GeoDatabaseTableComponent } from './app/pages/Home/GeoDatabaseTableComponent';
import { HomePage } from './app/pages/Home/HomePage';
import { FetchGADMResourcesComponent } from './app/pages/ResourceItemsComponent/FetchGADMResourcesComponent';
import { ResourceItemLoader } from './app/pages/ResourceItemsComponent/ResourceItemLoader';
import { ProjectItemLoader } from './app/pages/ProjectItemsComponent/ProjectItemLoader';
import { GeoDatabaseTableType } from './app/pages/Home/GeoDatabaseTableType';
import {
  Flag,
  LocationCity,
  PsychologyAlt,
  Public,
  Route,
} from '@mui/icons-material';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    children: [
      {
        path: '/resources',
        element: (
          <GeoDatabaseTableComponent type={GeoDatabaseTableType.resources} />
        ),
        loader: ResourceItemLoader,
        children: [
          {
            path: '/resources/gadm',
            element: <FetchGADMResourcesComponent />,
          },
        ],
      },
      {
        path: '/resources-new',
        element: (
          <GeoDatabaseItemCreateModeSelector
            items={[
              {
                icon: <Flag fontSize="large" />,
                name: 'GADM GeoJSON',
                url: `/resources/gadm`,
              },
              {
                icon: <LocationCity fontSize="large" />,
                name: 'IDE-GSM Cities',
                url: `/resources/cities`,
              },
              {
                icon: <Route fontSize="large" />,
                name: 'IDE-GSM Routes',
                url: `/resources/routes`,
              },
            ]}
          />
        ),
      },
      {
        path: '/projects',
        element: (
          <GeoDatabaseTableComponent type={GeoDatabaseTableType.projects} />
        ),
        loader: ProjectItemLoader,
      },
      {
        path: '/projects-new',
        element: (
          <GeoDatabaseItemCreateModeSelector
            items={[
              {
                icon: <PsychologyAlt fontSize="large" />,
                name: 'Theoretical Model',
                url: `/create/${GeoDatabaseType.theoretical}`,
              },
              {
                icon: <Public fontSize="large" />,
                name: 'Real-World Model',
                url: `/create/${GeoDatabaseType.realWorld}`,
              },
            ]}
          />
        ),
      },
    ],
  },
  {
    path: `/delete/${GeoDatabaseType.theoretical}/:uuid`,
    element: <DeleteDatabaseItemDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.realWorld,
    }),
  },
  {
    path: `/delete/${GeoDatabaseType.realWorld}/:uuid`,
    element: <DeleteDatabaseItemDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.realWorld,
    }),
  },
  {
    path: `/create/${GeoDatabaseType.theoretical}`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.theoretical,
    }),
  },
  {
    path: `/create/${GeoDatabaseType.realWorld}`,
    element: <UpsertGeoProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.realWorld,
    }),
  },
  {
    path: `/update/${GeoDatabaseType.theoretical}/:uuid`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.theoretical,
    }),
  },
  {
    path: `/update/${GeoDatabaseType.realWorld}/:uuid`,
    element: <UpsertGeoProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.realWorld,
    }),
  },
  {
    path: '/map/:uuid/:zoom/:latitude/:longitude',
    element: <RealWorldSimPage />,
    loader: async (request: any) => ({
      uuid: request.params.uuid,
      latitude: parseFloat(request.params.latitude),
      longitude: parseFloat(request.params.longitude),
      zoom: parseFloat(request.params.zoom),
      projectDB: await GeoDatabase.open(request.params.uuid),
    }),
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
