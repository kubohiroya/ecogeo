import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GeoDatabase } from './app/services/database/GeoDatabase';
import { GeoDatabaseItemCreateModeSelector } from './app/pages/Home/GeoDatabaseItemCreateModeSelector';
import { UpsertTheoreticalProjectDialog } from './app/pages/ProjectCreator/UpsertTheoreticalProjectDialog';
import { createProjectLoader } from './app/pages/ProjectCreator/createProjectLoader';
import { UpsertGeoProjectDialog } from './app/pages/ProjectCreator/UpsertGeoProjectDialog';
import { GeoDatabaseType } from './app/services/database/GeoDatabaseType';
import { DeleteDatabaseItemDialog } from './app/pages/DatabaseItemMenu/DeleteDatabaseItemDialog';
import { GeoDatabaseTableComponent } from './app/pages/Home/GeoDatabaseTableComponent';
import { HomePage } from './app/pages/Home/HomePage';
import { GADMGeoJsonComponent } from './app/pages/ResourceItemsComponent/GADMGeoJsonComponent';
import { ResourceItemLoader } from './app/pages/ResourceItemsComponent/ResourceItemLoader';
import { ProjectItemLoader } from './app/pages/ProjectItemsComponent/ProjectItemLoader';
import { GeoDatabaseTableType } from './app/pages/Home/GeoDatabaseTableType';
import {
  Flag,
  LocationCity,
  PanoramaFishEye,
  Public,
  Route,
  Share,
} from '@mui/icons-material';
import { IdeGsmCitiesComponent } from './app/pages/ResourceItemsComponent/IdeGsmCitiesComponent';
import { IdeGsmRoutesComponent } from './app/pages/ResourceItemsComponent/IdeGsmRoutesComponent';
import { RealWorldSimPage } from './app/pages/Sim/RealWorldSimPage';
import { RaceTrackSimPage } from './app/pages/Sim/RaceTrackSimPage';

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
            element: <GADMGeoJsonComponent />,
          },
          {
            path: '/resources/cities',
            element: <IdeGsmCitiesComponent />,
          },
          {
            path: '/resources/routes',
            element: <IdeGsmRoutesComponent />,
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
                icon: <PanoramaFishEye fontSize="large" />,
                name: 'Racetrack Model',
                url: `/create/${GeoDatabaseType.racetrack}`,
              },
              {
                icon: <Share fontSize="large" />,
                name: 'Graph Structured Model',
                url: `/create/${GeoDatabaseType.racetrack}`,
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
    path: `/delete/${GeoDatabaseType.racetrack}/:uuid`,
    element: <DeleteDatabaseItemDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.racetrack,
    }),
  },
  {
    path: `/delete/${GeoDatabaseType.graph}/:uuid`,
    element: <DeleteDatabaseItemDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.graph,
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
    path: `/create/${GeoDatabaseType.racetrack}`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.racetrack,
    }),
  },
  {
    path: `/create/${GeoDatabaseType.graph}`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.graph,
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
    path: `/update/${GeoDatabaseType.racetrack}/:uuid`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.racetrack,
    }),
  },
  {
    path: `/update/${GeoDatabaseType.graph}/:uuid`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: GeoDatabaseType.graph,
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
    path: '/racetrack/:uuid/:zoom/:y/:x',
    element: <RaceTrackSimPage />,
    loader: async (request: any) => ({
      uuid: request.params.uuid,
      x: parseFloat(request.params.x),
      y: parseFloat(request.params.y),
      zoom: parseFloat(request.params.zoom),
      projectDB: await GeoDatabase.open(request.params.uuid),
    }),
  },
  {
    path: '/graph/:uuid/:zoom/:y/:x',
    element: <RaceTrackSimPage />,
    loader: async (request: any) => ({
      uuid: request.params.uuid,
      y: parseFloat(request.params.y),
      x: parseFloat(request.params.x),
      zoom: parseFloat(request.params.zoom),
      projectDB: await GeoDatabase.open(request.params.uuid),
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
