// dexieWorker.js
import { DexieQueryRequestPayload } from '../app/services/project/DexieQueryRequestPayload';
import { ProjectDB } from '../app/services/project/ProjectDB';

async function processQueue(
  db: ProjectDB,
  id: number,
  payload: DexieQueryRequestPayload,
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

    const payload = JSON.parse(
      message.data.payload,
    ) as DexieQueryRequestPayload;
    const dbName = payload.dbName;
    const db = new ProjectDB(dbName);
    processQueue(db, message.data.id, payload);
  },
);

const ctx: Worker = self as any;

export default {} as typeof Worker & (new () => Worker);
