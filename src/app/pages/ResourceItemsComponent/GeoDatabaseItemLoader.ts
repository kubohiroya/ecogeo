import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { ProjectType } from '../../services/database/ProjectType';

export async function GeoDatabaseItemLoader(request: any) {
  const resources = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .equals(ProjectType.resource)
    .toArray();
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([ProjectType.racetrack, ProjectType.graph, ProjectType.realWorld])
    .toArray();

  return {
    resources,
    projects,
  };
}
