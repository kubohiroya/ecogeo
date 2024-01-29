import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { GeoDatabaseType } from '../../services/database/GeoDatabaseType';

export async function GeoDatabaseItemLoader(request: any) {
  const resources = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .equals(GeoDatabaseType.resource)
    .toArray();
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([
      GeoDatabaseType.racetrack,
      GeoDatabaseType.graph,
      GeoDatabaseType.realWorld,
    ])
    .toArray();

  return {
    resources,
    projects,
  };
}
