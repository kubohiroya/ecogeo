import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { ProjectIndexPage } from './app/pages/ProjectIndex/ProjectIndexPage';
import { RealWorldSimPage } from './app/pages/RealWorldSimPage';
import { ProjectTableDB } from './app/services/projectTable/ProjectTableDB';
import { ProjectDB } from './app/services/project/ProjectDB';
import { CreateProjectSelector } from './app/pages/ProjectCreator/CreateProjectSelector';
import { UpsertTheoreticalProjectDialog } from './app/pages/ProjectCreator/UpsertTheoreticalProjectDialog';
import { createProjectLoader } from './app/pages/ProjectCreator/createProjectLoader';
import { UpsertGeoProjectDialog } from './app/pages/ProjectCreator/UpsertGeoProjectDialog';
import { ProjectType } from './app/pages/ProjectIndex/ProjectType';
import { DeleteProjectDialog } from './app/pages/ProjectIndex/DeleteProjectDialog';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/projects" replace />,
  },
  {
    path: '/projects',
    element: <ProjectIndexPage />,
    loader: async () => ({
      projects: await ProjectTableDB.getProjects(),
    }),
  },
  {
    path: `/delete/${ProjectType.theoretical}/:uuid`,
    element: <DeleteProjectDialog />,
    loader: createProjectLoader({
      type: ProjectType.realWorld,
    }),
  },
  {
    path: `/delete/${ProjectType.realWorld}/:uuid`,
    element: <DeleteProjectDialog />,
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
