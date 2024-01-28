import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { GeoDatabaseType } from '../../services/database/GeoDatabaseType';

export async function ProjectItemLoader(request: any) {
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([
      GeoDatabaseType.racetrack,
      GeoDatabaseType.graph,
      GeoDatabaseType.realWorld,
    ])
    .toArray();

  return {
    projects,
  };
}
