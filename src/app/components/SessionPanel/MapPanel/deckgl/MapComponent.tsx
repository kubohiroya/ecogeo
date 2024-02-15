import React, { useCallback, useEffect, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react/typed";
import { Map as ReactMap } from "react-map-gl/maplibre";
import { MapView, PickingInfo } from "@deck.gl/core/typed";
import { getBounds } from "~/app/utils/mapUtil";
import { getTilesMortonNumbersForAllZooms, MAX_ZOOM_LEVEL, modifyMortonNumbers } from "~/app/utils/mortonNumberUtil";
import { deepEqual } from "@deck.gl/core/src/utils/deep-equal";
import { WorkerPool } from "~/app/worker/WorkerPool";
import GeoQueryWorker from "../../../../worker/GeoQueryWorker?worker";
import { CircularProgress } from "@mui/material";
import { useLoaderData, useNavigate } from "react-router-dom";
import { QueryRequest } from "~/app/models/QueryRequest";
import { GeoRequestPayload } from "~/app/models/GeoRequestPayload";
import { SimLoaderResult } from "~/app/pages/Sim/SimLoader";
import { ViewStateChangeParameters } from "@deck.gl/core/typed/controllers/controller";
import { ProjectTypes } from "~/app/models/ProjectType";

import { createLayers } from "~/app/components/SessionPanel/MapPanel/deckgl/createLayers";
import { throttleDebounce } from "~/app/utils/throttleDebounce";
import { GeoResponseTransferable } from "~/app/worker/GeoResponseTransferable";

const MAP_TILER_API_KEY = import.meta.env.VITE_MAP_TILER_API_KEY;

/*
type PointSrc = {
  name: string;
  position: [number, number];
};
type LineSrc = {
  name: string;
  sourcePosition: [number, number];
  targetPosition: [number, number];
};

type RouteSegmentSrc = {
  source: number;
  target: number;
};

type RouteSegment = {
  source: [number, number];
  target: [number, number];
};

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

  resourceUuid: string[];
}

type ViewStateType = {
  longitude: number;
  latitude: number;
  zoom: number;
};

/*
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
 */

export const MapComponent = (props: MapComponentProps) => {
  const data = useLoaderData() as SimLoaderResult;

  const [viewState, setViewState] = useState<ViewStateType>({
    longitude: data.x,
    latitude: data.y,
    zoom: data.zoom,
  });

  const [mortonNumbers, setMortonNumbers] = useState<number[][]>([]);
  const [hoverInfo /*setHoverInfo*/] = useState<PickingInfo | null>(null);

  const [geoResponse, setGeoResponse] =
    useState<GeoResponseTransferable | null>(null);

  const [gl, setGl] = useState<WebGLRenderingContext | null>(null);

  const onWebGLInitialized = useCallback((gl: WebGLRenderingContext) => {
    setGl(gl);
  }, []);

  const layers = useMemo(() => {
    if (gl === null || !geoResponse) {
      return [];
    }
    const circlesBuffer = geoResponse[0];
    const linesBuffer = geoResponse[1];
    const lineIndices = geoResponse[2];
    const positions = geoResponse[3];
    const polygonMetadata = geoResponse[4];
    const polygonIndices = geoResponse[5];
    const pathIndices = geoResponse[6];
    const positionIndices = geoResponse[7];

    console.log({
      circlesBuffer,
      linesBuffer,
      lineIndices,
      positions,
      polygonMetadata,
      polygonIndices,
      pathIndices,
      positionIndices,
    });

    return createLayers(
      gl,
      circlesBuffer,
      linesBuffer,
      lineIndices,
      positions,
      polygonMetadata,
      polygonIndices,
      pathIndices,
      positionIndices,
    );
  }, [gl, geoResponse]);

  const [worker, setWorker] = useState<null | WorkerPool<
    QueryRequest<GeoRequestPayload>,
    GeoResponseTransferable
  >>(null);

  const navigate = useNavigate();

  const updateURL = useCallback(
    ({ zoom, latitude, longitude }: ViewStateType): void => {
      throttleDebounce(
        () => {
          const url = `/${ProjectTypes.RealWorld}/${data.uuid}/${zoom.toFixed(2)}/${latitude.toFixed(4)}/${longitude.toFixed(4)}/`;
          return navigate(url, { replace: true });
        },
        100,
        300,
      )();
    },
    [data.uuid, navigate],
  );

  const [currentTaskId, setCurrentTaskId] = useState<number>(-1);

  useEffect(() => {
    const worker = new WorkerPool<
      QueryRequest<GeoRequestPayload>,
      GeoResponseTransferable
    >(GeoQueryWorker, 10, (response: GeoResponseTransferable) => {
      try {
        setGeoResponse(response);
      } catch (error) {
        console.log(error, response);
      }
    });
    setWorker(worker);
    return () => {
      if (worker) worker.terminateAllTasks();
    };
  }, []);

  useEffect(() => {
    if (worker === null || props.width === 0 || props.height === 0) return;

    const { topLeft, bottomRight } = getBounds(
      props.width,
      props.height,
      { lng: viewState.longitude!, lat: viewState.latitude! },
      viewState.zoom!,
    );

    const zoom = Math.ceil(viewState.zoom!);

    const newMortonNumbers = getTilesMortonNumbersForAllZooms(
      topLeft,
      bottomRight,
      zoom,
    );

    if (deepEqual(mortonNumbers, newMortonNumbers[MAX_ZOOM_LEVEL - 1], 2))
      return;

    setMortonNumbers(newMortonNumbers[MAX_ZOOM_LEVEL - 1]);

    if (currentTaskId !== -1) worker.terminateTask(currentTaskId);

    const newTaskId = currentTaskId + 1;
    setCurrentTaskId(newTaskId);
    worker.executeTask({
      type: 'dexie',
      id: newTaskId,
      payload: {
        uuid: props.resourceUuid,
        mortonNumbers: modifyMortonNumbers(newMortonNumbers),
        zoom: Math.floor(viewState.zoom!),
      },
    });
  }, [
    worker,
    props.width,
    props.height,
    props.resourceUuid,
    viewState.longitude,
    viewState.latitude,
    viewState.zoom,
    mortonNumbers,
    currentTaskId,
  ]);

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

  const updateURLThrottledDebounced = useCallback(
    throttleDebounce(updateURL, 100, 200),
    [updateURL],
  );

  useEffect(() => {
    updateURLThrottledDebounced(viewState);
  }, [viewState]);

  const onViewStateChange = useCallback(
    (evt: ViewStateChangeParameters & { viewId: string }) => {
      if (evt.viewState === undefined || evt.viewState.zoom >= MAX_ZOOM_LEVEL)
        return;
      const newViewState = evt.viewState as ViewStateType;
      setViewState(newViewState);
    },
    [],
  );

  if (!worker || currentTaskId === -1) {
    // mortonNumbers.length === 0 || polygons.length === 0 || points.length === 0;
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
      onWebGLInitialized={onWebGLInitialized}
      onViewStateChange={onViewStateChange}
    >
      <ReactMap
        mapStyle={`https://api.maptiler.com/maps/${props.map}/style.json?key=${MAP_TILER_API_KEY}`}
      />
      {renderTooltip()}
      {props.children}
    </DeckGL>
  );
};
