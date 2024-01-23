export const MAX_ZOOM_LEVEL = 10;

/*
function part1by1(n: number): number {
  n &= 0x0000ffff;
  n = (n ^ (n << 8)) & 0x00ff00ff;
  n = (n ^ (n << 4)) & 0x0f0f0f0f;
  n = (n ^ (n << 2)) & 0x33333333;
  n = (n ^ (n << 1)) & 0x55555555;
  return n;
}

function unpart1by1(n: number): number {
  n &= 0x55555555;
  n = (n ^ (n >> 1)) & 0x33333333;
  n = (n ^ (n >> 2)) & 0x0f0f0f0f;
  n = (n ^ (n >> 4)) & 0x00ff00ff;
  n = (n ^ (n >> 8)) & 0x0000ffff;
  return n;
}

export function mortonEncode(x: number, y: number): number {
  return part1by1(x) | (part1by1(y) << 1);
}

export function mortonDecode(morton: number): [number, number] {
  return [unpart1by1(morton), unpart1by1(morton >> 1)];
}*/

/*
export function mortonNumberToXYZ(morton: number): [number, number, number] {
  let x = 0,
    y = 0,
    z = 0;
  for (let i = 0; i < 32; i++) {
    x |= (morton & (1 << (3 * i))) >> (2 * i);
    y |= (morton & (1 << (3 * i + 1))) >> (2 * i + 1);
    z |= (morton & (1 << (3 * i + 2))) >> (2 * i + 2);
  }
  return [x, y, z];
}

export function getMortonNumbersForRectangle({
  lat1,
  lat2,
  lon1,
  lon2,
  zoom,
}: {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
  zoom: number;
}): number[] {
  const { x: x1, y: y1, z: z1 } = latLonToTileCoord(lat1, lon1, zoom);
  const { x: x2, y: y2, z: z2 } = latLonToTileCoord(lat2, lon2, zoom);
  const mortonNumbers = [];
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      mortonNumbers.push(tileCoordToMortonNumber(x, y, zoom));
    }
  }
  if (Math.abs(lon1 - lon2) > 180) {
    const { x: x1, y: y1, z: z1 } = latLonToTileCoord(lat1, lon1 + 360, zoom);
    const { x: x2, y: y2, z: z2 } = latLonToTileCoord(lat2, lon2 - 360, zoom);
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        mortonNumbers.push(tileCoordToMortonNumber(x, y, zoom));
      }
    }
  }
  return mortonNumbers;
}

function latLonToTileCoord(
  lat: number,
  lon: number,
  z: number,
): { x: number; y: number; z: number } {
  const n = Math.pow(2, z);
  const x = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { x, y, z };
}

function tileCoordToMortonNumber(x: number, y: number, z: number): number {
  let morton = 0;
  for (let i = 0; i < z; i++) {
    morton |= ((x & (1 << i)) << i) | ((y & (1 << i)) << (i + 1));
  }
  return morton;
}

function mortonNumberToTileCoord(morton: number): [number, number, number] {
  let x = 0,
    y = 0,
    z = 0;
  for (let i = 0; i < 32; i += 2) {
    x |= (morton & (1 << i)) >> i;
    y |= (morton & (1 << (i + 1))) >> i;
    z++;
  }
  return [x, y, z];
}
*/

export enum SpecialMortonNumbers {
  NOT_CONTAINED = -1,
}

export type LatLng = { lat: number; lng: number };
export type TileXYZ = { x: number; y: number; z: number };

const TILE_SIZE: number = 256;

export function latLngToGlobalPixel(
  latlng: LatLng,
  zoom: number,
): { x: number; y: number } {
  let siny = Math.sin((latlng.lat * Math.PI) / 180);
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  const x = TILE_SIZE * (0.5 + latlng.lng / 360) * Math.pow(2, zoom);
  const y =
    TILE_SIZE *
    (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)) *
    Math.pow(2, zoom);
  return { x, y };
}

export function globalPixelToLatLng(
  pixel: { x: number; y: number },
  zoom: number,
): LatLng {
  const scale = Math.pow(2, zoom);

  const lng = (pixel.x / scale / TILE_SIZE - 0.5) * 360;
  const latRadians = (pixel.y / scale / TILE_SIZE - 0.5) * (-2 * Math.PI);
  const lat = (Math.atan(Math.sinh(latRadians)) * 180) / Math.PI;

  return { lat, lng };
}

export function globalPixelToTileXYZ(
  pixel: { x: number; y: number },
  zoom: number,
): TileXYZ {
  return {
    x: Math.floor(pixel.x / TILE_SIZE),
    y: Math.floor(pixel.y / TILE_SIZE),
    z: zoom,
  };
}

export function tileXYZToMorton({ x, y, z }: TileXYZ): number {
  let morton = 0;
  for (let i = 0; i < z; i++) {
    const mask = 1 << i;
    if ((x & mask) !== 0) {
      morton |= 1 << (2 * i);
    }
    if ((y & mask) !== 0) {
      morton |= 1 << (2 * i + 1);
    }
  }
  return morton;
}

export function calculateOptimalZoom(
  topLeft: LatLng,
  bottomRight: LatLng,
): number {
  let zoom = MAX_ZOOM_LEVEL;
  while (zoom > 0) {
    const topLeftTile = globalPixelToTileXYZ(
      latLngToGlobalPixel(topLeft, zoom),
      zoom,
    );
    const bottomRightTile = globalPixelToTileXYZ(
      latLngToGlobalPixel(bottomRight, zoom),
      zoom,
    );

    const mortonTopLeft = tileXYZToMorton(topLeftTile);
    const mortonBottomRight = tileXYZToMorton(bottomRightTile);

    if (mortonTopLeft !== mortonBottomRight) {
      break;
    }
    zoom--;
  }
  return zoom;
}

export function getTileMortonNumbers(
  topLeft: LatLng,
  bottomRight: LatLng,
  zoom?: number,
): number[][] {
  if (zoom === undefined) {
    zoom = calculateOptimalZoom(topLeft, bottomRight);
  }
  if (zoom < 0 || zoom > MAX_ZOOM_LEVEL) {
    throw new Error(`Invalid zoom level: ${zoom}`);
  }

  // 日付変更線をまたがる場合の対応
  if (topLeft.lng > bottomRight.lng) {
    // 日付変更線をまたぐ場合、左側と右側を分割して処理
    const leftSide = getTilesForHalf(
      topLeft,
      { lat: bottomRight.lat, lng: 180 },
      zoom,
    );
    const rightSide = getTilesForHalf(
      { lat: topLeft.lat, lng: -180 },
      bottomRight,
      zoom,
    );
    return [leftSide, rightSide];
  } else {
    if (topLeft.lng == -180 && bottomRight.lng == 180) {
      return [[0]];
    } else {
      return [getTilesForHalf(topLeft, bottomRight, zoom)];
    }
  }
}

export function getTilesForHalf(
  topLeft: LatLng,
  bottomRight: LatLng,
  zoom: number,
): number[] {
  const topLeftPixel = latLngToGlobalPixel(topLeft, zoom);
  const bottomRightPixel = latLngToGlobalPixel(bottomRight, zoom);

  const topLeftTile = globalPixelToTileXYZ(topLeftPixel, zoom);
  const bottomRightTile = globalPixelToTileXYZ(bottomRightPixel, zoom);

  const mortonNumbers = [];
  for (let x = topLeftTile.x; x <= bottomRightTile.x; x++) {
    for (let y = topLeftTile.y; y <= bottomRightTile.y; y++) {
      mortonNumbers.push(tileXYZToMorton({ x, y, z: zoom }));
    }
  }
  return mortonNumbers;
}

export function getTilesMortonNumbersForAllZooms(
  topLeft: LatLng,
  bottomRight: LatLng,
  maxZoom: number,
): number[][][] {
  if (maxZoom < 0 || maxZoom > MAX_ZOOM_LEVEL) {
    throw new Error(`Invalid max zoom level: ${maxZoom}`);
  }

  const allZoomsMortonNumbers: number[][][] = new Array<number[][]>(
    MAX_ZOOM_LEVEL,
  );
  for (let zoom = 0; zoom <= maxZoom; zoom++) {
    allZoomsMortonNumbers[zoom] = getTileMortonNumbers(
      topLeft,
      bottomRight,
      zoom,
    );
  }
  for (let zoom = maxZoom + 1; zoom <= MAX_ZOOM_LEVEL; zoom++) {
    allZoomsMortonNumbers[zoom] = allZoomsMortonNumbers[zoom - 1];
  }
  return allZoomsMortonNumbers;
}

export function getTilesMortonNumbersForAllZoomsMap(
  topLeft: LatLng,
  bottomRight: LatLng,
  maxZoom: number,
): Record<string, number[][]> {
  if (maxZoom < 0 || maxZoom > MAX_ZOOM_LEVEL) {
    throw new Error(`Invalid max zoom level: ${maxZoom}`);
  }

  const allZoomsMortonNumbers: Record<string, number[][]> = {};
  for (let zoom = 0; zoom <= maxZoom; zoom++) {
    allZoomsMortonNumbers[`z${zoom}`] = getTileMortonNumbers(
      topLeft,
      bottomRight,
      zoom,
    );
  }
  return allZoomsMortonNumbers;
}

export const modifyMortonNumbers = (mortonNumbers: number[][][]) => {
  const modifiedMortonNumbers: number[][][] = [];
  mortonNumbers.forEach((mortonNumber, zoom: number) => {
    if (zoom === 0) {
      modifiedMortonNumbers.push(mortonNumber);
    } else {
      modifiedMortonNumbers.push(
        mortonNumber.length == 1
          ? [mortonNumbers[zoom][0].concat(modifiedMortonNumbers[zoom - 1][0])]
          : mortonNumber.length == 2
            ? [
                modifiedMortonNumbers[zoom - 1][0].concat(
                  mortonNumbers[zoom][0],
                ),
                modifiedMortonNumbers[zoom - 1].length == 2
                  ? modifiedMortonNumbers[zoom - 1][1].concat(
                      mortonNumbers[zoom][1],
                    )
                  : mortonNumbers[zoom][1],
              ]
            : [],
      );
    }
  });
  return modifiedMortonNumbers;
};


/*
// 使用例
const topLeft: LatLng = { lat: 35.7, lng: 139.7 }; // 左上の座標
const bottomRight: LatLng = { lat: 35.65, lng: 139.75 }; // 右下の座標
const zoomLevel: number = 15;

const mortonNumbers = WebMercatorUtils.getTileMortonNumbers(
  topLeft,
  bottomRight,
  zoomLevel,
);
console.log(mortonNumbers);
 */