import { LoaderFunctionArgs } from 'react-router-dom';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { ResourceTypes } from '../../models/ResourceEntity';
import { GeoDatabaseEntity } from '../../services/database/GeoDatabaseEntity';

export async function ResourceItemLoader(
  request: LoaderFunctionArgs | undefined,
): Promise<{ resources: GeoDatabaseEntity[] }> {
  const resources = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([
      ResourceTypes.gadmShapes,
      ResourceTypes.idegsmCities,
      ResourceTypes.idegsmRoutes,
    ])
    .toArray();
  return {
    resources,
  };
}
