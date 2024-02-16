import React, { StrictMode } from 'react';

import { createHashRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { SimLoader } from '~/app/pages/Sim/SimLoader';
import { SimPage } from '~/app/pages/Sim/SimPage';
import { HomePage } from '~/app/pages/Home/HomePage';
import { GeoDatabaseTableComponent } from '~/app/pages/Home/GeoDatabaseTableComponent';
import { ResourceEntitiesComponent } from '~/app/pages/Home/resource/ResourceEntitiesComponent';
import { ProjectEntitiesComponent } from '~/app/pages/Home/project/ProjectEntitiesComponent';
import { ResourceEntitiesLoader } from '~/app/pages/Home/resource/ResourceEntitiesLoader';
import { ResourceTypeSelector } from '~/app/pages/Home/resource/ResourceTypeSelector';
import { GADMGeoJsonDialog } from '~/app/pages/Home/resource/gadm/GADMGeoJsonDialog';
import { IdeGsmCitiesDialog } from '~/app/pages/Home/resource/ideGsmCities/IdeGsmCitiesDialog';
import { IdeGsmRoutesDialog } from '~/app/pages/Home/resource/ideGsmRoutes/IdeGsmRoutesDialog';
import { GeoDatabaseEntityDeleteDialog } from '~/app/pages/Home/GeoDatabaseEntityDeleteDialog';
import { databaseItemLoader } from '~/app/pages/Home/databaseItemLoader';
import { ProjectEntitiesLoader } from '~/app/pages/Home/project/ProjectEntitiesLoader';
import { ProjectTypeSelector } from '~/app/pages/Home/project/ProjectTypeSelector';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { GeoJsonDialog } from '~/app/pages/Home/resource/geoJson/GeoJsonDialog';
import { MapTilerDialog } from '~/app/pages/Home/resource/mapTiler/MapTilerDialog';
import { ResourceUpsertDialog } from '~/app/pages/Home/resource/ResourceUpsertDialog';
import { ProjectUpsertDialog } from '~/app/pages/Home/project/ProjectUpsertDialog';

console.log('built: 2024-02-14 19:39');
const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
    children: [
      {
        path: '/resources',
        element: (
          <GeoDatabaseTableComponent
            type={GeoDatabaseTableTypes.resources}
            items={[
              <ResourceEntitiesComponent />,
              <ProjectEntitiesComponent />,
            ]}
          />
        ),
        loader: ResourceEntitiesLoader,
        children: [
          {
            path: '/resources/new',
            element: <ResourceTypeSelector />,
          },
          {
            path: '/resources/create/mapTiler',
            element: <MapTilerDialog />,
          },
          {
            path: '/resources/create/gadm',
            element: <GADMGeoJsonDialog />,
          },
          {
            path: '/resources/create/geojson',
            element: <GeoJsonDialog />,
          },
          {
            path: '/resources/create/cities',
            element: <IdeGsmCitiesDialog />,
          },
          {
            path: '/resources/create/routes',
            element: <IdeGsmRoutesDialog />,
          },

          {
            path: `/resources/delete/:type/:uuid`,
            element: (
              <GeoDatabaseEntityDeleteDialog
                tableType={GeoDatabaseTableTypes.resources}
              />
            ),
            loader: databaseItemLoader,
          },
          {
            path: `/resources/update/:type/:uuid`,
            element: <ResourceUpsertDialog />,
            loader: databaseItemLoader,
          },
        ],
      },
      {
        path: '/projects',
        element: (
          <GeoDatabaseTableComponent
            type={GeoDatabaseTableTypes.projects}
            items={[
              <ResourceEntitiesComponent />,
              <ProjectEntitiesComponent />,
            ]}
          />
        ),
        loader: ProjectEntitiesLoader,
        children: [
          {
            path: '/projects/new',
            element: <ProjectTypeSelector />,
          },
          {
            path: `/projects/delete/:type/:uuid`,
            element: (
              <GeoDatabaseEntityDeleteDialog
                tableType={GeoDatabaseTableTypes.projects}
              />
            ),
            loader: databaseItemLoader,
          },
          {
            path: `/projects/create/:type`,
            element: <ProjectUpsertDialog />,
            loader: databaseItemLoader,
          },
          {
            path: `/projects/update/:type/:uuid`,
            element: <ProjectUpsertDialog />,
            loader: databaseItemLoader,
          },
        ],
      },
    ],
  },
  {
    path: '/:projectType/:uuid/:zoom/:y/:x/',
    element: <SimPage />,
    loader: SimLoader,
  },
]);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
