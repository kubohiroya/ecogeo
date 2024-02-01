import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { ProjectTypes } from '../../services/database/ProjectType';

export async function ProjectItemLoader(request: any) {
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([ProjectTypes.Racetrack, ProjectTypes.Graph, ProjectTypes.RealWorld])
    .toArray();

  return {
    projects,
  };
}
