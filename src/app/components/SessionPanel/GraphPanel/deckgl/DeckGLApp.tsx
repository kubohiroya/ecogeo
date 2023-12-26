import React from 'react';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { BitmapLayer, PathLayer } from '@deck.gl/layers/typed';
import styled from '@emotion/styled';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react/typed';
import { MapView } from '@deck.gl/core/typed';

const INITIAL_VIEW_STATE = {
  latitude: 47.65,
  longitude: 7,
  zoom: 4.5,
  maxZoom: 20,
  maxPitch: 89,
  bearing: 0,
};

const CopyRightLicense = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: hsla(0, 0%, 100%, 0.5);
  padding: 0 5px;
  font: 12px/20px Helvetica Neue, Arial, Helvetica, sans-serif;
`;

const LINK_STYLE = {
  textDecoration: 'none',
  color: 'rgba(0,0,0,.75)',
  cursor: 'grab',
};

/* global window */
const devicePixelRatio =
  (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

const getTooltip: any = (
  tile: { index: { x: number; y: number; z: number } | null } | null
): string | null => {
  if (tile && tile.index) {
    const { x, y, z } = tile.index;
    return `tile: x: ${x}, y: ${y}, z: ${z}`;
  }
  return null;
};
export default function DeckGLApp({ showBorder = false, onTilesLoad = null }) {
  const tileLayer = new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ],

    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 20,

    pickable: true,
    onViewportLoad: onTilesLoad,
    autoHighlight: showBorder,
    highlightColor: [60, 60, 60, 40],
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: devicePixelRatio === 1 ? -1 : 0,
    renderSubLayers: (props) => {
      const [[west, south], [east, north]] = props.tile.boundingBox;
      /*
      const {
        bbox: { west, south, east, north }
      } = props.tile;
       */

      return [
        new BitmapLayer(props, {
          //data: null,
          image: props.data,
          bounds: [west, south, east, north],
        }),
        showBorder &&
          new PathLayer({
            id: `${props.id}-border`,
            data: [
              [
                [west, north],
                [west, south],
                [east, south],
                [east, north],
                [west, north],
              ],
            ],
            getPath: (d) => d,
            getColor: [255, 0, 0],
            widthMinPixels: 4,
          }),
      ];
    },
  });

  return (
    <DeckGL
      layers={[tileLayer]}
      views={new MapView({ repeat: true })}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
    >
      <CopyRightLicense>
        {'© '}
        <a
          style={LINK_STYLE}
          href="http://www.openstreetmap.org/copyright"
          target="blank"
        >
          OpenStreetMap contributors
        </a>
      </CopyRightLicense>
    </DeckGL>
  );
}
