import React from 'react';

import Map from 'react-map-gl/maplibre';

export interface MapProps {
  style?: React.CSSProperties;
  longitude: number;
  latitude: number;
  zoom: number;
}

const MAP_TILER_API_KEY = import.meta.env.VITE_MAP_TILER_API_KEY;

export const MapTilerBackground = (props: MapProps) => {
  return (
    <Map
      longitude={props.latitude}
      latitude={props.longitude}
      zoom={props.zoom}
      style={{ ...props.style }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAP_TILER_API_KEY}`}
    />
  );
};
