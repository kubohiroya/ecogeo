import React, { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { Map as ReactMap } from 'react-map-gl/maplibre';
import { PolygonLayer, ScatterplotLayer } from '@deck.gl/layers/typed';
import { MapView, PickingInfo } from '@deck.gl/core/typed';
import { getBounds } from '../../../../utils/mapUtil';
import {
  getTilesMortonNumbersForAllZooms,
  MAX_ZOOM_LEVEL,
  modifyMortonNumbers,
} from '../../../../utils/mortonNumberUtil';
import { deepEqual } from '@deck.gl/core/src/utils/deep-equal';
import { GeoRegionEntity } from '../../../../models/geo/GeoRegionEntity';
import { WorkerPool } from '../../../../../worker/WorkerPool';
import DexieQueryWorker from '../../../../../worker/DexieQueryWorker?worker';
import { CircularProgress } from '@mui/material';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { PathStyleExtension } from '@deck.gl/extensions/typed';
import { DexieQueryRequest } from '../../../../services/project/DexieQueryRequest';
import { DexieQueryResponse } from '../../../../services/project/DexieQueryResponse';
import { AsyncFunctionManager } from '../../../../utils/AsyncFunctionManager';

const MAP_TILER_API_KEY = import.meta.env.VITE_MAP_TILER_API_KEY;

type PointSrc = {
  name: string;
  coordinates: [number, number];
};

type RouteSegmentSrc = {
  source: number;
  target: number;
};

type RouteSegment = {
  source: [number, number];
  target: [number, number];
};
/*
const cities: PointSrc[] = [
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
  { name: 'Osaka', coordinates: [135.5022, 34.6937] },
  // 他の都市も同様に追加...
];
*/

/*
const routesSrc: RouteSegmentSrc[] = [
  { source: 0, target: 1 },
  // 他の都市間のルートも同様に追加...
];

const citiesMap = new Map<number, PointSrc>(
  cities.map((city) => [city.id, city]),
);

// 都市間の交通網のデータ
const routes: RouteSegment[] = routesSrc.map((src) => ({
  source: citiesMap.get(src.source)?.coordinates!,
  target: citiesMap.get(src.target)?.coordinates!,
}));
 */

export interface MapComponentProps {
  uuid: string;
  style?: React.CSSProperties;
  map: string;
  width: number;
  height: number;
  children?: React.ReactNode;
}

function lngOffsetPolygon(polygon: number[][], lngOffsets: number[] = [0]) {
  let ret: number[][] = [];
  lngOffsets.forEach((lngOffset) => {
    if (lngOffset === 0) {
      ret = polygon;
    } else {
      polygon.forEach((p) => ret.push([p[0] + lngOffset, p[1]]));
    }
  });
  return ret;
}

function extractPolygonLayerData(
  regionSet: GeoRegionEntity[][],
  lngOffsets: number[] = [0],
): { polygon: number[][]; name: string }[] {
  const ret: { polygon: number[][]; name: string }[] = [];
  regionSet.forEach((regions) => {
    regions.forEach((region) => {
      const name = `${region.country}/${region.name_1 || ''}/${
        region.name_2 || ''
      }`;
      region.coordinates.forEach((polygon) => {
        ret.push({
          polygon: lngOffsetPolygon(polygon, lngOffsets),
          name,
        });
      });
    });
  });
  return ret;
}

const asyncFunctionManager = new AsyncFunctionManager();
const MapComponent = (props: MapComponentProps) => {
  const data = useLoaderData() as {
    uuid: string;
    latitude: number;
    longitude: number;
    zoom: number;
  };

  const [viewState, setViewState] = useState({
    longitude: data.longitude,
    latitude: data.latitude,
    zoom: data.zoom,
    maxZoom: MAX_ZOOM_LEVEL - 1,
    minZoom: 0,
  });

  const [currentTaskId, setCurrentTaskId] = useState<number>(-1);
  const [mortonNumbers, setMortonNumbers] = useState<number[][]>([]);
  const [hoverInfo, setHoverInfo] = useState<PickingInfo | null>(null);

  const [polygons, setPolygons] = useState<{ polygon: number[][] }[][]>([
    [],
    [],
    [],
  ]);
  const [points, setPoints] = useState<
    { name: string; coordinates: number[] }[]
  >([]);

  const [worker, setWorker] = useState<any>(null);
  const navigate = useNavigate();

  const updateURL = (viewState: {
    zoom: number;
    latitude: number;
    longitude: number;
  }): void => {
    const url = `/map/${data.uuid}/${viewState.zoom.toFixed(2)}/${viewState.latitude.toFixed(4)}/${viewState.longitude.toFixed(4)}/`;
    asyncFunctionManager.runAsyncFunction(() => {
      navigate(url, { replace: true });
    });
  };

  useEffect(() => {
    const worker = new WorkerPool<DexieQueryRequest, DexieQueryResponse>(
      DexieQueryWorker,
      10,
      (response: DexieQueryResponse) => {
        try {
          const newPolygons = response.payload.polygons.map((region) =>
            extractPolygonLayerData(region),
          );
          setPolygons(newPolygons);

          const newPoints = response.payload.points
            .flat(1)
            .map((geoPointEntity) => {
              return {
                name: geoPointEntity.name,
                coordinates: [geoPointEntity.lng, geoPointEntity.lat],
              };
            });
          setPoints(newPoints);
        } catch (error) {
          console.log(error, response);
        }
      },
    );
    setWorker(worker);
    return () => {
      if (worker) worker.terminateAllTasks();
    };
  }, []);

  useEffect(() => {
    if (worker == null || props.width == 0 || props.height == 0) return;

    const { topLeft, bottomRight } = getBounds(
      props.width,
      props.height,
      { lng: viewState.longitude, lat: viewState.latitude },
      viewState.zoom,
    );

    const zoom = Math.ceil(viewState.zoom);

    const newMortonNumbers = getTilesMortonNumbersForAllZooms(
      topLeft,
      bottomRight,
      zoom,
    );

    if (deepEqual(mortonNumbers, newMortonNumbers[MAX_ZOOM_LEVEL - 1], 2))
      return;

    setMortonNumbers(newMortonNumbers[MAX_ZOOM_LEVEL - 1]);

    if (currentTaskId != -1) worker.terminateTask(currentTaskId);

    const newTaskId = currentTaskId + 1;
    setCurrentTaskId(newTaskId);
    worker.executeTask({
      dbName: props.uuid,
      type: 'dexie',
      id: newTaskId,
      payload: {
        mortonNumbers: modifyMortonNumbers(newMortonNumbers),
        zoom: Math.floor(viewState.zoom),
      },
    });
  }, [
    worker,
    viewState.longitude,
    viewState.latitude,
    viewState.zoom,
    props.width,
    props.height,
  ]);

  // レイヤーの設定
  const layers = [
    new PolygonLayer({
      id: 'region1-layer',
      pickable: true,
      data: polygons[1],
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getPolygon: (d) => d.polygon,
      //getElevation: (d) => d.population / d.area / 10,
      getFillColor: (d) => [10, 80, 10, 5],
      getLineColor: (d) => [40, 100, 40],
      getLineWidth: 1,
      getDashArray: [3, 2],
      dashJustified: true,
      dashGapPickable: true,
      extensions: [new PathStyleExtension({ dash: true })],
      onHover: (info) => setHoverInfo(info),
    }),
    new PolygonLayer({
      id: 'region2-layer',
      pickable: true,
      data: polygons[1],
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getPolygon: (d) => d.polygon,
      //getElevation: (d) => d.population / d.area / 10,
      //getFillColor: (d) => [d.population / d.area / 60, 140, 0],
      getFillColor: (d) => [80, 10, 10, 5],
      getLineColor: (d) => [80, 80, 100],
      getLineWidth: 1,
      onHover: (info) => setHoverInfo(info),
    }),
    new PolygonLayer({
      id: 'country-layer',
      pickable: true,
      data: polygons[0],
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      lineWidthScale: 10,
      getPolygon: (d) => d.polygon,
      //getElevation: (d) => d.population / d.area / 10,
      getFillColor: (d) => [10, 10, 80, 5],
      getLineColor: (d) => [200, 200, 40],
      getLineWidth: 1,
      onHover: (info) => setHoverInfo(info),
    }),

    new ScatterplotLayer({
      id: 'scatter-plot-layer',
      data: points,
      getPosition: (d: PointSrc) => d.coordinates,
      getRadius: 2000,
      getFillColor: [255, 0, 0],
      pickable: true,
      onHover: (info) => setHoverInfo(info),
    }),
    /*
    new TextLayer({
      id: 'text-layer',
      data: points,
      getPosition: (d: PointSrc) => [d.coordinates[0], d.coordinates[1] - 0.02],
      getText: (d: PointSrc) => d.name,
      getSize: 10,
      getColor: [255, 0, 0],
      pickable: true,
      onHover: (info) => setHoverInfo(info),
    }
)*/
    /*
    new LineLayer({
      id: 'line-layer',
      data: routes,
      getSourcePosition: (d: RouteSegment) => d.source,
      getTargetPosition: (d: RouteSegment) => d.target,
      getColor: [0, 0, 255],
      getWidth: 2,
      pickable: true,
      onHover: (info) => setHoverInfo(info),
    }),
     */
  ];

  // ツールチップの表示
  const renderTooltip = () => {
    if (!hoverInfo) return;
    const { object: hoveredObject, x, y } = hoverInfo;
    if (!hoveredObject) return null;
    const tooltipData = hoveredObject.polygon
      ? `Region: ${hoveredObject.name}`
      : hoveredObject.name
        ? `Location: ${hoveredObject.name}`
        : `Route: ${hoveredObject.source} - ${hoveredObject.target}`;

    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          pointerEvents: 'none',
          left: x,
          top: y,
          color: 'white',
          backgroundColor: 'black',
          padding: '5px',
        }}
      >
        {tooltipData}
      </div>
    );
  };

  const viewStateChange = (evt: any) => {
    setViewState(evt.viewState);
  };

  useEffect(() => {
    updateURL(viewState);
  }, [viewState]);

  if (!worker || currentTaskId == -1) {
    /*
    mortonNumbers.length == 0 ||
    polygons.length == 0 ||
    points.length == 0
    */
    return <CircularProgress variant="indeterminate" />;
  }

  return (
    <DeckGL
      views={[new MapView({ repeat: true })]}
      width={props.width}
      height={props.height}
      controller={true}
      layers={layers}
      viewState={viewState}
      onViewStateChange={viewStateChange}
    >
      <ReactMap
        mapStyle={`https://api.maptiler.com/maps/${props.map}/style.json?key=${MAP_TILER_API_KEY}`}
      />
      {renderTooltip()}
      {props.children}
    </DeckGL>
  );
};

export default MapComponent;
