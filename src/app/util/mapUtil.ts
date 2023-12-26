interface GISPointSource {
  label: string;
  lat: number;
  lng: number;
}

interface GISPoint extends GISPointSource {
  z2: number;
  z3: number;
  z4: number;
  z5: number;
  z6: number;
  z7: number;
  z8: number;
  z9: number;
  z10: number;
  z11: number;
  z12: number;
  z13: number;
  z14: number;
  z15: number;
}

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
  maxZoom: number = 18
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

function calculateTileNumber(
  latitude: number,
  longitude: number,
  zoomLevel: number
): { x: number; y: number } {
  const x = Math.floor(((longitude + 180) / 360) * Math.pow(2, zoomLevel));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((latitude * Math.PI) / 180) +
          1 / Math.cos((latitude * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoomLevel)
  );
  return { x, y };
}

function calculateMortonNumber({ x, y }: { x: number; y: number }): number {
  let morton = 0;
  for (let i = 0; i < Math.max(x, y).toString(2).length; i++) {
    morton += (((x >> i) & 1) << (2 * i + ((y >> i) & 1))) << (2 * i + 1);
  }
  return morton;
}

function getMortonNumberSet(
  north: number,
  south: number,
  east: number,
  west: number,
  zoomLevel: number
): Set<number> {
  let xMin = calculateTileNumber(north, west, zoomLevel).x;
  let xMax = calculateTileNumber(south, east, zoomLevel).x;
  const yMin = calculateTileNumber(north, west, zoomLevel).y;
  const yMax = calculateTileNumber(south, east, zoomLevel).y;
  const mortonNumberSet = new Set<number>();

  if (west > east) {
    // 経度180度を跨ぐ場合
    xMax += Math.pow(2, zoomLevel); // タイルのインデックスを調整
  }

  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      const realX = x % Math.pow(2, zoomLevel); // 実際のタイル番号に変換
      mortonNumberSet.add(calculateMortonNumber({ x: realX, y }));
    }
  }

  return mortonNumberSet;
}

import Dexie from 'dexie';

class GISDatabase extends Dexie {
  public points: Dexie.Table<GISPoint, number>;

  public constructor() {
    super('GISDatabase');
    this.version(1).stores({
      points:
        '++id, label, lat, lng, z2, z3, z4, z5, z6, z7, z8, z9, z10, z11, z12, z13, z14, z15',
    });
    this.points = this.table('points');
  }
}

const db = new GISDatabase();

export async function storeGISPoints(
  source: Array<GISPointSource>
): Promise<void> {
  const gisPoints: GISPoint[] = source.map((s) => {
    // GISPointへの変換ロジックをここに記述
    // 例：各ズームレベルにおけるタイル番号の計算
    return {
      ...s,
      z2: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 2)),
      z3: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 3)),
      z4: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 4)),
      z5: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 5)),
      z6: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 6)),
      z7: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 7)),
      z8: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 8)),
      z9: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 9)),
      z10: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 10)),
      z11: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 11)),
      z12: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 12)),
      z13: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 13)),
      z14: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 14)),
      z15: calculateMortonNumber(calculateTileNumber(s.lat, s.lng, 15)),
    };
  });

  await db.points.bulkAdd(gisPoints);
}

export async function searchGISPoints({
  north,
  south,
  east,
  west,
}: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<Array<GISPoint>> {
  const zoomLevel = calculateZoomLevel(north, south, east, west);
  const mortonNumbers = getMortonNumberSet(north, south, east, west, zoomLevel);
  return await db.points
    .where(`z${zoomLevel}`)
    .anyOf(Array.from(mortonNumbers))
    .toArray();
}
