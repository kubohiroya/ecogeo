// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { StrictMode } from "react";

import { createBrowserRouter, LoaderFunctionArgs, RouterProvider } from "react-router-dom";
import { GeoDatabase } from "./app/services/database/GeoDatabase";
import { GeoDatabaseItemCreateModeSelector } from "./app/pages/Home/GeoDatabaseItemCreateModeSelector";
import { projectLoader } from "./app/pages/ProjectCreator/projectLoader";
import { ProjectTypes } from "./app/services/database/ProjectType";
import { DeleteDatabaseItemDialog } from "./app/pages/DatabaseItemMenu/DeleteDatabaseItemDialog";
import { GeoDatabaseTableComponent } from "./app/pages/Home/GeoDatabaseTableComponent";
import { HomePage } from "./app/pages/Home/HomePage";
import { GADMGeoJsonComponent } from "./app/pages/ResourceItemsComponent/GADMGeoJsonComponent";
import { GeoDatabaseItemLoader } from "./app/pages/ResourceItemsComponent/GeoDatabaseItemLoader";
import { GeoDatabaseTableType } from "./app/pages/Home/GeoDatabaseTableType";
import { Flag, LocationCity, PanoramaFishEye, Public, Route, Share } from "@mui/icons-material";
import { IdeGsmCitiesComponent } from "./app/pages/ResourceItemsComponent/IdeGsmCitiesComponent";
import { IdeGsmRoutesComponent } from "./app/pages/ResourceItemsComponent/IdeGsmRoutesComponent";
import { RealWorldSimPage } from "./app/pages/Sim/RealWorldSimPage";
import { RaceTrackSimPage } from "./app/pages/Sim/RaceTrackSimPage";
import { ProjectItemsComponent } from "./app/pages/ProjectItemsComponent/ProjectItemsComponent";
import { ResourceItemsComponent } from "./app/pages/ResourceItemsComponent/ResourceItemsComponent";
import { FileDropComponent } from "./components/FileDropComponent/FileDropComponent";
import { UpsertGeoProjectDialog } from "./app/pages/ProjectCreator/UpsertGeoProjectDialog";
import { createRoot } from "react-dom/client";

const router = createBrowserRouter([
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
        loader: GeoDatabaseItemLoader,
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
        loader: GeoDatabaseItemLoader,
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
                      url: `/create/${ProjectTypes.racetrack}`,
                      tooltip: "Paul Krugman's spatial economy model",
                    },
                    {
                      icon: <Share fontSize="large" />,
                      name: 'Graph Structured Model',
                      url: `/create/${ProjectTypes.racetrack}`,
                      tooltip: 'Graph structured spatial economy model',
                    },
                    {
                      icon: <Public fontSize="large" />,
                      name: 'Real-World Model',
                      url: `/create/${ProjectTypes.realWorld}`,
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
    path: '/racetrack/:uuid/:zoom/:y/:x/',
    element: (
      <div
        style={{
          overscrollBehavior: 'none',
          overflow: 'hidden',
          width: '100vw',
          height: '100vh',
        }}
      >
        <RaceTrackSimPage />
      </div>
    ),

    loader: async (
      request: LoaderFunctionArgs<{
        params: { uuid: string; x: string; y: string; zoom: string };
      }>,
    ) => ({
      uuid: request.params.uuid,
      x: parseFloat(request.params.x!),
      y: parseFloat(request.params.y!),
      zoom: parseFloat(request.params.zoom!),
      projectDB: await GeoDatabase.open(request.params.uuid!),
    }),
  },
  {
    path: '/graph/:uuid/:zoom/:y/:x/',
    element: <RaceTrackSimPage />,
    loader: async (
      request: LoaderFunctionArgs<{
        params: { uuid: string; x: string; y: string; zoom: string };
      }>,
    ) => ({
      uuid: request.params.uuid,
      x: parseFloat(request.params.x!),
      y: parseFloat(request.params.y!),
      zoom: parseFloat(request.params.zoom!),
      projectDB: await GeoDatabase.open(request.params.uuid!),
    }),
  },
  {
    path: '/map/:uuid/:zoom/:latitude/:longitude/',
    element: (
      <div
        style={{
          overscrollBehavior: 'none',
          overflow: 'hidden',
          width: '100vw',
          height: '100vh',
        }}
      >
        <RealWorldSimPage />
      </div>
    ),

    loader: async (
      request: LoaderFunctionArgs<{
        params: {
          uuid: string;
          longitude: string;
          latitude: string;
          zoom: string;
        };
      }>,
    ) => ({
      uuid: request.params.uuid,
      latitude: parseFloat(request.params.latitude!),
      longitude: parseFloat(request.params.longitude!),
      zoom: parseFloat(request.params.zoom!),
      projectDB: await GeoDatabase.open(request.params.uuid!),
    }),
  },
]);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
