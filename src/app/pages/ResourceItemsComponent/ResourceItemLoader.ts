import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { GeoDatabaseType } from '../../services/database/GeoDatabaseType';

export async function ResourceItemLoader(request: any) {
  const resources = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .equals(GeoDatabaseType.resource)
    .toArray();

  return {
    resources,
  };
}
