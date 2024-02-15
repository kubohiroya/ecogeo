import { globalPixelToLatLng, LatLng, latLngToGlobalPixel } from "./mortonNumberUtil";
/*
export function calculateMortonNumber(coordinate: number[]): number {
  let morton = 0;
  for (
    let i = 0;
    i < Math.max(coordinate[0], coordinate[1]).toString(2).length;
    i++
  ) {
    morton +=
      (((coordinate[0] >> i) & 1) << (2 * i + ((coordinate[1] >> i) & 1))) <<
      (2 * i + 1);
  }
  return morton;
}

export function calculateMortonNumberForSpace(
  north: number,
  south: number,
  east: number,
  west: number,
): number {
  let zoomLevel = 1;
  let mortonNorthWest, mortonSouthEast;
  do {
    mortonNorthWest = calculateMortonNumber(
      calculateTileNumber(north, west, zoomLevel),
    );
    mortonSouthEast = calculateMortonNumber(
      calculateTileNumber(south, east, zoomLevel),
    );
    zoomLevel++;
  } while (mortonNorthWest === mortonSouthEast && zoomLevel <= 20); // 20はXYZタイルの最大ズームレベル
  return mortonNorthWest;
}
 */

/*
export function calculateTileNumber(
  latitude: number,
  longitude: number,
  zoomLevel: number,
): number[] {
  const x = Math.floor(((longitude + 180) / 360) * Math.pow(2, zoomLevel));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((latitude * Math.PI) / 180) +
          1 / Math.cos((latitude * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoomLevel),
  );
  return [x, y];
}

export function calculateMortonNumbersOfZoomLevels(
  mortonNumber: number,
  maxZoomLevel: number = 15,
): MortonNumbers {
  const mortonNumbers: number[] = [];

  for (let zoomLevel = 1; zoomLevel <= maxZoomLevel; zoomLevel++) {
    let currentMorton = 0;
    for (let i = 0; i < zoomLevel; i++) {
      currentMorton |= ((mortonNumber >> (2 * i)) & 1) << (2 * i);
      currentMorton |= ((mortonNumber >> (2 * i + 1)) & 1) << (2 * i + 1);
    }
    mortonNumbers.push(currentMorton);
  }

  return {
    z2: mortonNumbers[1] || -1,
    z3: mortonNumbers[2] || -1,
    z4: mortonNumbers[3] || -1,
    z5: mortonNumbers[4] || -1,
    z6: mortonNumbers[5] || -1,
    z7: mortonNumbers[6] || -1,
    z8: mortonNumbers[7] || -1,
    z9: mortonNumbers[8] || -1,
    z10: mortonNumbers[9] || -1,
    z11: mortonNumbers[10] || -1,
    z12: mortonNumbers[11] || -1,
    z13: mortonNumbers[12] || -1,
    z14: mortonNumbers[13] || -1,
    z15: mortonNumbers[14] || -1,
  };
}*/

export function getPolygonsBounds(polygons: number[][][][]): {
  topLeft: LatLng;
  bottomRight: LatLng;
} {
  let lngmin = Number.POSITIVE_INFINITY;
  let lngmax = Number.NEGATIVE_INFINITY;
  let latmin = Number.POSITIVE_INFINITY;
  let latmax = Number.NEGATIVE_INFINITY;
  for (const polygonGroup of polygons) {
    for (let i = 0; i < polygonGroup.length; i += 2) {
      // 0, 2, 4, 6... : polygons
      // 1, 3, 5, 7... : polygon holes
      const polygon = polygonGroup[i];
      for (const vertex of polygon) {
        const lng = vertex[0];
        const lat = vertex[1];
        if (lng < lngmin) lngmin = lng;
        if (lng > lngmax) lngmax = lng;
        if (lat < latmin) latmin = lat;
        if (lat > latmax) latmax = lat;
      }
    }
  }
  return {
    topLeft: { lng: lngmin, lat: latmax },
    bottomRight: { lng: lngmax, lat: latmin },
  };
}

export function getBounds(
  width: number,
  height: number,
  center: LatLng,
  zoom: number,
): {
  topLeft: LatLng;
  bottomRight: LatLng;
} {
  const centerPx = latLngToGlobalPixel(center, zoom);
  const topLeftPx = { x: centerPx.x - width / 2, y: centerPx.y - height / 2 };
  const bottomRightPx = {
    x: centerPx.x + width / 2,
    y: centerPx.y + height / 2,
  };

  return {
    topLeft: globalPixelToLatLng(topLeftPx, zoom),
    bottomRight: globalPixelToLatLng(bottomRightPx, zoom),
  };
}

/*
type LatLng = { lat: number; lng: number };
type Pixel = { x: number; y: number };
const TILE_SIZE: number = 256;

function latLngToPixels(latlng: LatLng, zoom: number): Pixel {
  const siny = Math.sin((latlng.lat * Math.PI) / 180);

  // 緯度をクランプ
  const clippedSiny = Math.min(Math.max(siny, -0.9999), 0.9999);

  const x = TILE_SIZE * (0.5 + latlng.lng / 360);
  const y =
    TILE_SIZE *
    (0.5 - Math.log((1 + clippedSiny) / (1 - clippedSiny)) / (4 * Math.PI));

  const scale = 1 << zoom;
  return { x: x * scale, y: y * scale };
}

function pixelsToLatLng(pixel: Pixel, zoom: number): LatLng {
  const scale = 1 / (1 << zoom);
  const lng = ((pixel.x * scale) / TILE_SIZE - 0.5) * 360;
  const latRadians = ((pixel.y * scale) / TILE_SIZE - 0.5) * (-2 * Math.PI);
  const lat = (Math.atan(Math.sinh(latRadians)) * 180) / Math.PI;
  return { lat, lng };
}

*/
/*
export function getBounds(
  width: number,
  height: number,
  center: { lat: number; lng: number },
  zoom: number,
): {
  topLeft: { lat: number; lng: number };
  bottomRight: { lat: number; lng: number };
} {
  const tileSize = 256;
  const scale = Math.pow(2, zoom);
  const centerPixel = {
    x:
      (((center.lng < 0 ? center.lng + 360 : center.lng) + 180) / 360) *
      tileSize *
      scale,
    y:
      ((1 -
        Math.log(
          Math.tan((center.lat * Math.PI) / 180) +
            1 / Math.cos((center.lat * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
      tileSize *
      scale,
  };
  const topLeftPixel = {
    x: centerPixel.x - width / 2,
    y: centerPixel.y - height / 2,
  };
  const bottomRightPixel = {
    x: centerPixel.x + width / 2,
    y: centerPixel.y + height / 2,
  };
  const topLeft = {
    lat:
      90 -
      (360 / Math.PI) *
        Math.atan(Math.exp((-topLeftPixel.y / scale / tileSize) * 2 * Math.PI)),
    lng: (topLeftPixel.x / scale / tileSize) * 360 - 180,
  };
  const bottomRight = {
    lat:
      90 -
      (360 / Math.PI) *
        Math.atan(
          Math.exp((-bottomRightPixel.y / scale / tileSize) * 2 * Math.PI),
        ),
    lng: (bottomRightPixel.x / scale / tileSize) * 360 - 180,
  };
  return { topLeft, bottomRight };
}
*/

/*
export function convertToXYZ({
  x,
  y,
  zoom,
}: {
  x: number;
  y: number;
  zoom: number;
}): {
  X: number;
  Y: number;
  Z: number;
} {
  const X = (x / 1000) * -180;
  const Y = (y / 500) * 90;
  // Zの計算方法は例示的なものです。必要に応じて調整してください。
  //const Z = Math.floor(Math.min(18, Math.max(2, 1 / zoom * 18)));
  const Z = zoom;
  // console.log({ x, y, zoom: zoom }, { X, Y, Z });
  return { X, Y, Z };
}

function calculateZoomLevel(
  north: number,
  south: number,
  east: number,
  west: number,
  maxZoom: number = 18,
): number {
  const latDiff = north - south;
  let lngDiff = east - west;

  // 日付変更線を考慮した経度差の計算
  if (lngDiff < 0) {
    lngDiff += 360; // 西経と東経を跨ぐ場合の調整
  }

  let zoom = 0;
  let latZoom = maxZoom;
  let lngZoom = maxZoom;

  // 緯度に基づくズームレベルの計算
  while (latZoom > 0 && 180 / Math.pow(2, latZoom) > latDiff) {
    latZoom--;
  }

  // 経度に基づくズームレベルの計算
  while (lngZoom > 0 && 360 / Math.pow(2, lngZoom) > lngDiff) {
    lngZoom--;
  }

  // 最終的なズームレベルは緯度と経度の小さい方に合わせる
  zoom = Math.min(latZoom, lngZoom);

  return zoom;
}

export function calculateXYZSet({
  north,
  south,
  east,
  west,
  zoom,
}: {
  north: number;
  south: number;
  east: number;
  west: number;
  zoom: number;
}): Set<number> {
  console.log('A', { north, south, east, west });

  const min = calculateTileNumber(north, west, zoom);
  const max = calculateTileNumber(south, east, zoom);
  const xMin = min[0];
  const yMin = min[1];
  let xMax = max[0];
  const yMax = max[1];
  const mortonNumberSet = new Set<number>();
  if (west > east) {
    // 経度180度を跨ぐ場合
    xMax += Math.pow(2, zoom); // タイルのインデックスを調整
  }

  console.log('B', { xMin, xMax, yMin, yMax });

  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      const realX = x % Math.pow(2, zoom); // 実際のタイル番号に変換
      mortonNumberSet.add(calculateMortonNumber([realX, y]));
    }
  }
  return mortonNumberSet;
}

function findLevelFromXor(xorResult: number): number {
  let level = 0;
  while (xorResult > 0) {
    xorResult >>= 2; // 2ビットずつシフト
    level++;
  }
  return level;
}

export function calculateZoomLevelFromMortonNumber(
  mortonNumber: number,
): number {
  let level = 0;
  while (mortonNumber > 0) {
    mortonNumber >>= 2; // 2ビット右シフト
    level++;
  }
  return level;
}

export function calculateBoundingBox(coordinates: number[][][][]): number[] {
  let minX: number = Infinity;
  let maxX: number = -Infinity;
  let minY: number = Infinity;
  let maxY: number = -Infinity;

  coordinates.forEach((polygon) => {
    polygon.forEach((points) => {
      points.forEach((point) => {
        const [lng, lat] = point;
        if (lng < minX) minX = lng;
        if (lng > maxX) maxX = lng;
        if (lat < minY) minY = lat;
        if (lat > maxY) maxY = lat;
      });
    });
  });
  return [minX, minY, maxX, maxY];
}

function lonLatToPixel({
  lon,
  lat,
  zoom,
}: {
  lon: number;
  lat: number;
  zoom: number;
}) {
  const x = ((lon + 180) / 360) * Math.pow(2, zoom);
  const y =
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
    Math.pow(2, zoom);
  return { x, y };
}

function pixelToLonLat(x: number, y: number, zoom: number) {
  const lon = (x / Math.pow(2, zoom)) * 360 - 180;
  const latRad = Math.atan(
    Math.sinh(Math.PI * (1 - (2 * y) / Math.pow(2, zoom))),
  );
  const lat = (latRad * 180) / Math.PI;
  return { lat, lon };
}

function calculateMapBounds(
  width: number,
  height: number,
  centerLon: number,
  centerLat: number,
  zoom: number,
) {
  const centerPx = lonLatToPixel({ lon: centerLon, lat: centerLat, zoom });
  console.log({ width, height, centerLon, centerLat, zoom }, centerPx);
  const topLeftPx = { x: centerPx.x - width / 2, y: centerPx.y - height / 2 };
  const bottomRightPx = {
    x: centerPx.x + width / 2,
    y: centerPx.y + height / 2,
  };
  const topLeftLonLat = pixelToLonLat(topLeftPx.x, topLeftPx.y, zoom);
  const bottomRightLonLat = pixelToLonLat(
    bottomRightPx.x,
    bottomRightPx.y,
    zoom,
  );

  // 経度が-180度より小さい場合に360度を加算
  if (topLeftLonLat.lon < -180) topLeftLonLat.lon += 360;
  if (bottomRightLonLat.lon < -180) bottomRightLonLat.lon += 360;

  // 経度が180度より大きい場合に360度を減算
  if (topLeftLonLat.lon > 180) topLeftLonLat.lon -= 360;
  if (bottomRightLonLat.lon > 180) bottomRightLonLat.lon -= 360;

  const bounds = {
    north: topLeftLonLat.lat,
    south: bottomRightLonLat.lat,
    west: topLeftLonLat.lon,
    east: bottomRightLonLat.lon,
    zoom,
  };
  console.log('*', bounds);
  return bounds;
}

type TileRange = {
  xRange: [number, number];
  yRange: [number, number];
};

function latLngToTileXY(
  lat: number,
  lng: number,
  zoom: number,
): [number, number] {
  const tile_size = 256; // 標準的なタイルサイズは256x256ピクセル
  const num_tiles = 1 << zoom; // 2のズームレベル乗

  const x = (lng + 180) / 360;
  const sin_lat = Math.sin((Math.PI / 180) * lat);
  const y = 0.5 - Math.log((1 + sin_lat) / (1 - sin_lat)) / (4 * Math.PI);

  const tile_x = Math.floor(x * num_tiles);
  const tile_y = Math.floor(y * num_tiles);
  return [tile_x, tile_y];
}

function getTileRange(
  zoom: number,
  latTop: number,
  lngLeft: number,
  latBottom: number,
  lngRight: number,
): TileRange {
  const [topLeftX, topLeftY] = latLngToTileXY(latTop, lngLeft, zoom);
  const [bottomRightX, bottomRightY] = latLngToTileXY(
    latBottom,
    lngRight,
    zoom,
  );

  return {
    xRange: [topLeftX, bottomRightX],
    yRange: [topLeftY, bottomRightY],
  };
}
 */
