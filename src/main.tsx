import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RealWorldSimPage } from './app/pages/RealWorldSim/RealWorldSimPage';
import { ProjectTableDB } from './app/services/projectTable/ProjectTableDB';
import { ProjectDB } from './app/services/project/ProjectDB';
import { CreateProjectSelector } from './app/pages/ProjectCreator/CreateProjectSelector';
import { UpsertTheoreticalProjectDialog } from './app/pages/ProjectCreator/UpsertTheoreticalProjectDialog';
import { createProjectLoader } from './app/pages/ProjectCreator/createProjectLoader';
import { UpsertGeoProjectDialog } from './app/pages/ProjectCreator/UpsertGeoProjectDialog';
import { ProjectType } from './app/models/ProjectType';
import { DeleteDatabaseItemDialog } from './app/pages/DatabaseItemMenu/DeleteDatabaseItemDialog';

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { DatabaseItemTableComponent } from './app/pages/Home/DatabaseItemTableComponent';
import { HomePage } from './app/pages/Home/HomePage';
import { FetchGADMResourcesComponent } from './app/pages/ResourceItemsComponent/FetchGADMResourcesComponent';

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
        element: <DatabaseItemTableComponent mode={0} />,
        loader: async () => ({
          resources: [],
        }),
        children: [
          {
            path: '/resources/gadm',
            element: <FetchGADMResourcesComponent />,
          },
        ],
      },
      {
        path: '/projects',
        element: <DatabaseItemTableComponent mode={1} />,
        loader: async () => ({
          projects: await ProjectTableDB.getProjects(),
        }),
      },
    ],
  },
  {
    path: `/delete/${ProjectType.theoretical}/:uuid`,
    element: <DeleteDatabaseItemDialog />,
    loader: createProjectLoader({
      type: ProjectType.realWorld,
    }),
  },
  {
    path: `/delete/${ProjectType.realWorld}/:uuid`,
    element: <DeleteDatabaseItemDialog />,
    loader: createProjectLoader({
      type: ProjectType.realWorld,
    }),
  },
  {
    path: '/create',
    element: <CreateProjectSelector />,
  },
  {
    path: `/create/${ProjectType.theoretical}`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: ProjectType.theoretical,
    }),
  },
  {
    path: `/create/${ProjectType.realWorld}`,
    element: <UpsertGeoProjectDialog />,
    loader: createProjectLoader({
      type: ProjectType.realWorld,
    }),
  },
  {
    path: `/update/${ProjectType.theoretical}/:uuid`,
    element: <UpsertTheoreticalProjectDialog />,
    loader: createProjectLoader({
      type: ProjectType.theoretical,
    }),
  },
  {
    path: `/update/${ProjectType.realWorld}/:uuid`,
    element: <UpsertGeoProjectDialog />,
    loader: createProjectLoader({
      type: ProjectType.realWorld,
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
      projectDB: await ProjectDB.getProjectDB(request.params.uuid),
    }),
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
