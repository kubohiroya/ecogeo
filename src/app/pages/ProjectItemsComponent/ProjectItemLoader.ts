import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { ProjectType } from '../../services/database/ProjectType';

export async function ProjectItemLoader(request: any) {
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([ProjectType.racetrack, ProjectType.graph, ProjectType.realWorld])
    .toArray();

  return {
    projects,
  };
}
