import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';

export const projectLoader =
  () =>
  async ({ params }: any) => {
    return params.uuid !== undefined
      ? await GeoDatabaseTable.getSingleton()
          .databases.where('uuid')
          .equals(params.uuid)
          .last()
      : {
          uuid: undefined,
          type: params.type,
        };
  };
