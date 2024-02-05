// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { StrictMode } from "react";

import { createHashRouter, RouterProvider } from "react-router-dom";
import { databaseItemLoader } from "./app/pages/ProjectCreator/databaseItemLoader";
import { DeleteDatabaseItemDialog } from "./app/pages/DatabaseItemMenu/DeleteDatabaseItemDialog";
import { GeoDatabaseTableComponent } from "./app/pages/Home/GeoDatabaseTableComponent";
import { HomePage } from "./app/pages/Home/HomePage";
import { GADMGeoJsonDialog } from "./app/pages/ResourceEntitiesComponent/GADMGeoJsonDialog";
import { DatabaseTableTypes } from "./app/services/database/GeoDatabaseTableType";
import { IdeGsmCitiesComponent } from "./app/pages/ResourceEntitiesComponent/IdeGsmCitiesComponent";
import { IdeGsmRoutesComponent } from "./app/pages/ResourceEntitiesComponent/IdeGsmRoutesComponent";
import { ProjectEntitiesComponent } from "./app/pages/ProjectEntitiesComponent/ProjectEntitiesComponent";
import { ResourceEntitiesComponent } from "./app/pages/ResourceEntitiesComponent/ResourceEntitiesComponent";
import { createRoot } from "react-dom/client";
import { SimLoader } from "./app/pages/Sim/SimLoader";
import { SimPage } from "./app/pages/Sim/SimPage";
import { UpsertResourceDialog } from "./app/pages/ProjectCreator/UpsertResourceDialog";
import { UpsertProjectDialog } from "./app/pages/ProjectCreator/UpsertProjectDialog";
import { NewResourceEntitySelector } from "./app/pages/ResourceEntitiesComponent/NewResourceEntitySelector";
import { NewProjectEntitySelector } from "./app/pages/ProjectEntitiesComponent/NewProjectEntitySelector";
import { ResourceEntitiesLoader } from "./app/pages/ResourceEntitiesComponent/ResourceEntitiesLoader";
import { ProjectEntitiesLoader } from "./app/pages/ProjectEntitiesComponent/ProjectEntitiesLoader";

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
    children: [
      {
        path: '/resources',
        element: (
          <GeoDatabaseTableComponent
            type={DatabaseTableTypes.resources}
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
              <DeleteDatabaseItemDialog
                tableType={DatabaseTableTypes.resources}
              />
            ),
            loader: databaseItemLoader,
          },
          {
            path: `/resources/update/:type/:uuid`,
            element: <UpsertResourceDialog />,
            loader: databaseItemLoader,
          },
        ],
      },
      {
        path: '/projects',
        element: (
          <GeoDatabaseTableComponent
            type={DatabaseTableTypes.projects}
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
              <DeleteDatabaseItemDialog
                tableType={DatabaseTableTypes.projects}
              />
            ),
            loader: databaseItemLoader,
          },
          {
            path: `/projects/create/:type`,
            element: <UpsertProjectDialog />,
            loader: databaseItemLoader,
          },
          {
            path: `/projects/update/:type/:uuid`,
            element: <UpsertProjectDialog />,
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
