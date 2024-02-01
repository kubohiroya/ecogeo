import { ProjectType } from './app/services/database/ProjectType';

export function createSimulatorLink(item: {
  uuid: string;
  type: ProjectType;
  viewportCenter: [number, number, number];
}) {
  return `/${item.type}/${item.uuid}/${item.viewportCenter[0]}/${item.viewportCenter[1]}/${item.viewportCenter[2]}/`;
}
