import { GeoDatabaseType } from './app/services/database/GeoDatabaseType';

export function createSimulatorLink(item: {
  uuid: string;
  type: GeoDatabaseType;
  coordinate: [number, number];
  zoom: number;
}) {
  switch (item.type) {
    case GeoDatabaseType.realWorld:
      return `/map/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    case GeoDatabaseType.racetrack:
      return `/racetrack/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    case GeoDatabaseType.graph:
      return `/graph/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    default:
      throw new Error();
  }
}
