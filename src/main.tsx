// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { StrictMode } from "react";

import { createHashRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { SimLoader } from "./app/pages/Sim/SimLoader";
import { SimPage } from "./app/pages/Sim/SimPage";
import { HomePage } from "./app/pages/Home/HomePage";
import { GeoDatabaseTableComponent } from "./app/pages/Home/GeoDatabaseTableComponent";
import { GeoDatabaseTableTypes } from "./app/services/database/GeoDatabaseTableType";
import { ResourceEntitiesComponent } from "./app/pages/Home/ResourceEntitiesComponent/ResourceEntitiesComponent";
import { ProjectEntitiesComponent } from "./app/pages/Home/ProjectEntitiesComponent/ProjectEntitiesComponent";
import { ResourceEntitiesLoader } from "./app/pages/Home/ResourceEntitiesComponent/ResourceEntitiesLoader";
import { NewResourceEntitySelector } from "./app/pages/Home/ResourceEntitiesComponent/NewResourceEntitySelector";
import { GADMGeoJsonDialog } from "./app/pages/Home/ResourceEntitiesComponent/GADMGeoJsonDialog";
import { IdeGsmCitiesComponent } from "./app/pages/Home/ResourceEntitiesComponent/IdeGsmCitiesComponent";
import { IdeGsmRoutesComponent } from "./app/pages/Home/ResourceEntitiesComponent/IdeGsmRoutesComponent";
import { GeoDatabaseEntityDeleteDialog } from "./app/pages/Home/GeoDatabaseEntityDeleteDialog";
import { databaseItemLoader } from "./app/pages/Home/databaseItemLoader";
import { ResourceUpsertDialog } from "./app/pages/Home/ResourceUpsertDialog";
import { ProjectEntitiesLoader } from "./app/pages/Home/ProjectEntitiesComponent/ProjectEntitiesLoader";
import { NewProjectEntitySelector } from "./app/pages/Home/ProjectEntitiesComponent/NewProjectEntitySelector";
import { ProjectUpsertDialog } from "./app/pages/Home/ProjectUpsertDialog";

console.log('built: 2024-02-06 15:49');
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
            element: <NewResourceEntitySelector />,
          },
          {
            path: '/resources/create/gadm',
            element: <GADMGeoJsonDialog />,
          },
          {
            path: '/resources/create/cities',
            element: <IdeGsmCitiesComponent />,
          },
          {
            path: '/resources/create/routes',
            element: <IdeGsmRoutesComponent />,
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
            element: <NewProjectEntitySelector />,
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
