import { GeoDatabaseTable, getCurrentDatabaseTableType } from "~/app/services/database/GeoDatabaseTable";

export const databaseItemLoader = async ({ params }: any) => {
  if (params.uuid === undefined) {
    return {
      uuid: undefined,
      type: params.type,
    };
  }
  const tableType = getCurrentDatabaseTableType();
  return GeoDatabaseTable.getTableByTableType(tableType)
    .where('uuid')
    .equals(params.uuid)
    .last();
};
