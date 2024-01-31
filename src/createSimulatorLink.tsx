import { ProjectType } from './app/services/database/ProjectType';

export function createSimulatorLink(item: {
  uuid: string;
  type: ProjectType;
  coordinate: [number, number];
  zoom: number;
}) {
  switch (item.type) {
    case ProjectType.realWorld:
      return `/map/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    case ProjectType.racetrack:
      return `/racetrack/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    case ProjectType.graph:
      return `/graph/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    default:
      throw new Error();
  }
}
