import { GeoRequestPayload } from "~/app/models/GeoRequestPayload";

import { convertMortonNumbersToTransferables } from "~/app/worker/convertMortonNumbersToTransferables";

async function processQueue(id: number, payload: GeoRequestPayload) {
  const transferables = await convertMortonNumbersToTransferables(
    payload.uuid,
    payload.mortonNumbers,
    payload.zoom,
  );

  postMessage(transferables);
}

onmessage = function geoQueryWorker(message: MessageEvent) {
  if (message.data.type !== 'dexie') {
    return;
  }
  const payload = JSON.parse(message.data.payload) as GeoRequestPayload;
  processQueue(message.data.id, payload);
};

export default {} as typeof Worker & (new () => Worker);
