import { ProjectType, ProjectTypes } from './app/services/database/ProjectType';

export function createSimulatorLink(item: {
  uuid: string;
  type: ProjectType;
  coordinate: [number, number];
  zoom: number;
}) {
  switch (item.type) {
    case ProjectTypes.realWorld:
      return `/map/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    case ProjectTypes.racetrack:
      return `/racetrack/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    case ProjectTypes.graph:
      return `/graph/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
    default:
      throw new Error();
  }
}
