import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { GeoDatabaseType } from '../../services/database/GeoDatabaseType';

export const createProjectLoader =
  ({ type }: { type: GeoDatabaseType }) =>
  async ({ params }: any) => {
    return params.uuid === undefined
      ? { uuid: undefined, type, name: '', description: '' }
      : await GeoDatabaseTable.getSingleton()
          .databases.where('uuid')
          .equals(params.uuid)
          .last();
  };
