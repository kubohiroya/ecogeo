// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { StrictMode } from "react";

import { createHashRouter, RouterProvider } from "react-router-dom";
import { GeoDatabaseItemCreateModeSelector } from "./app/pages/Home/GeoDatabaseItemCreateModeSelector";
import { projectLoader } from "./app/pages/ProjectCreator/projectLoader";
import { ProjectTypes } from "./app/services/database/ProjectType";
import { DeleteDatabaseItemDialog } from "./app/pages/DatabaseItemMenu/DeleteDatabaseItemDialog";
import { GeoDatabaseTableComponent } from "./app/pages/Home/GeoDatabaseTableComponent";
import { HomePage } from "./app/pages/Home/HomePage";
import { GADMGeoJsonComponent } from "./app/pages/ResourceItemsComponent/GADMGeoJsonComponent";
import { GeoDatabaseTableType } from "./app/pages/Home/GeoDatabaseTableType";
import { Flag, LocationCity, PanoramaFishEye, Public, Route, Share } from "@mui/icons-material";
import { IdeGsmCitiesComponent } from "./app/pages/ResourceItemsComponent/IdeGsmCitiesComponent";
import { IdeGsmRoutesComponent } from "./app/pages/ResourceItemsComponent/IdeGsmRoutesComponent";
import { ProjectItemsComponent } from "./app/pages/ProjectItemsComponent/ProjectItemsComponent";
import { ResourceItemsComponent } from "./app/pages/ResourceItemsComponent/ResourceItemsComponent";
import { FileDropComponent } from "./components/FileDropComponent/FileDropComponent";
import { UpsertGeoProjectDialog } from "./app/pages/ProjectCreator/UpsertGeoProjectDialog";
import { createRoot } from "react-dom/client";
import { SimLoader } from "./app/pages/Sim/SimLoader";
import { SimPage } from "./app/pages/Sim/SimPage";
import { ProjectItemLoader } from "./app/pages/ProjectItemsComponent/ProjectItemLoader";
import { ResourceItemLoader } from "./app/pages/ResourceItemsComponent/ResourceItemLoader";

const router = createHashRouter([
  {
    path: '/',

    element: <HomePage />,
    children: [
      {
        path: '/resources',
        element: (
          <GeoDatabaseTableComponent
            type={GeoDatabaseTableType.resources}
            items={[<ResourceItemsComponent />, <ProjectItemsComponent />]}
          />
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
        path: '/resources/new',
        element: (
          <FileDropComponent acceptableSuffixes={['.json', '.csv', '.csv.zip']}>
            <GeoDatabaseTableComponent
              type={GeoDatabaseTableType.resources}
              items={[
                <GeoDatabaseItemCreateModeSelector
                  type={GeoDatabaseTableType.resources}
                  items={[
                    {
                      icon: <Flag fontSize="large" />,
                      name: 'GADM GeoJSON',
                      url: `/resources/gadm`,
                      tooltip:
                        'GADM Country(Level 0),Region and Subregion shape files',
                    },
                    {
                      icon: <LocationCity fontSize="large" />,
                      name: 'IDE-GSM Cities',
                      url: `/resources/cities`,
                      tooltip:
                        'IDE-GSM data file includes city information, GDP, population, etc.',
                    },
                    {
                      icon: <Route fontSize="large" />,
                      name: 'IDE-GSM Routes',
                      url: `/resources/routes`,
                      tooltip:
                        'IDE-GSM data file includes route information, start, end, distance, etc.',
                    },
                  ]}
                />,
                <>dummy</>,
              ]}
            />
          </FileDropComponent>
        ),
      },
      {
        path: '/projects',
        element: (
          <GeoDatabaseTableComponent
            type={GeoDatabaseTableType.projects}
            items={[<ResourceItemsComponent />, <ProjectItemsComponent />]}
          />
        ),
        loader: ProjectItemLoader,
      },
      {
        path: '/projects/new',
        element: (
          <FileDropComponent acceptableSuffixes={['.json', '.csv', '.csv.zip']}>
            <GeoDatabaseTableComponent
              type={GeoDatabaseTableType.projects}
              items={[
                <>dummy</>,
                <GeoDatabaseItemCreateModeSelector
                  type={GeoDatabaseTableType.projects}
                  items={[
                    {
                      icon: <PanoramaFishEye fontSize="large" />,
                      name: 'Racetrack Model',
                      url: `/create/${ProjectTypes.Racetrack}`,
                      tooltip: "Paul Krugman's spatial economy model",
                    },
                    {
                      icon: <Share fontSize="large" />,
                      name: 'Graph Structured Model',
                      url: `/create/${ProjectTypes.Racetrack}`,
                      tooltip: 'Graph structured spatial economy model',
                    },
                    {
                      icon: <Public fontSize="large" />,
                      name: 'Real-World Model',
                      url: `/create/${ProjectTypes.RealWorld}`,
                      tooltip: 'Full-set simulation model',
                    },
                  ]}
                />,
              ]}
            />
          </FileDropComponent>
        ),
      },
    ],
  },
  {
    path: `/delete/:type/:uuid`,
    element: <DeleteDatabaseItemDialog />,
    loader: projectLoader(),
  },
  {
    path: `/create/:type`,
    element: <UpsertGeoProjectDialog />,
    loader: projectLoader(),
  },
  {
    path: `/update/:type/:uuid`,
    element: <UpsertGeoProjectDialog />,
    loader: projectLoader(),
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
