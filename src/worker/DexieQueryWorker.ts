// dexieWorker.js
import { GeoRequestPayload } from '../app/models/GeoRequestPayload';
import { GeoDatabase } from '../app/services/database/GeoDatabase';

async function processQueue(
  db: GeoDatabase,
  id: number,
  payload: GeoRequestPayload,
) {
  const polygons = await db.findAllGeoRegions(
    payload.mortonNumbers,
    payload.zoom,
  );

  const points = await db.findAllGeoPoints(payload.mortonNumbers, payload.zoom);

  const lines = await db.findAllGeoLineStrings(
    payload.mortonNumbers,
    payload.zoom,
  );

  self.postMessage(
    JSON.stringify({ id, payload: { polygons, points, lines } }),
  );
}

self.addEventListener(
  'message',
  function dexieQueryWorker(message: MessageEvent) {
    if (message.data.type !== 'dexie') {
      return;
    }

    const payload = JSON.parse(message.data.payload) as GeoRequestPayload;
    const dbName = payload.dbName;
    const db = new GeoDatabase(dbName);
    processQueue(db, message.data.id, payload);
  },
);

const ctx: Worker = self as any;

export default {} as typeof Worker & (new () => Worker);
