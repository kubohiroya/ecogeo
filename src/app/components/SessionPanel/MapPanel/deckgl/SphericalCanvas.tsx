import React from 'react';

import { CircleLayer, Layer, Map, Source } from 'react-map-gl/maplibre';
//import { CircleLayer } from 'react-map-gl';
import { FeatureCollection } from '@turf/turf';

export interface MapProps {
  style?: React.CSSProperties;
  longitude: number;
  latitude: number;
  zoom: number;
}

const MAP_TILER_API_KEY = import.meta.env.VITE_MAP_TILER_API_KEY;

const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-122.4, 37.8] },
      properties: { name: 'San Francisco' },
    },
  ],
};

const layerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
  source: 'my-data',
};

export const SphericalCanvas = (props: MapProps) => {
  const [viewState, setViewState] = React.useState({
    longitude: props.longitude,
    latitude: props.latitude,
    zoom: props.zoom,
  });

  return (
    <>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ ...props.style }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAP_TILER_API_KEY}`}
      >
        <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    </>
  );
};
