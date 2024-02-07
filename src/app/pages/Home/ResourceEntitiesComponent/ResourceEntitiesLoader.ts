import { GeoDatabaseTable } from '../../../services/database/GeoDatabaseTable';
import { ResourceTypes } from '../../../models/ResourceType';

export function ResourceEntitiesLoader(request: any) {
  return GeoDatabaseTable.getSingleton()
    .resources.where('type')
    .anyOf([
      ResourceTypes.gadmShapes,
      ResourceTypes.idegsmCities,
      ResourceTypes.idegsmRoutes,
    ])
    .toArray();
}
