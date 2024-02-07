import { GeoDatabaseTable } from 'src/app/services/database/GeoDatabaseTable';
import { ProjectTypes } from 'src/app/models/ProjectType';

export function ProjectEntitiesLoader(request: any) {
  return GeoDatabaseTable.getSingleton()
    .projects.where('type')
    .anyOf([ProjectTypes.Racetrack, ProjectTypes.Graph, ProjectTypes.RealWorld])
    .toArray();
}
