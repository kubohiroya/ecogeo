import { useLoaderData } from 'react-router-dom';
import { GeoDatabaseEntityUpsertDialog } from './GeoDatabaseEntityUpsertDialog';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { useCallback } from 'react';

export const ResourceUpsertDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: string;
    name: string | undefined;
    description: string | undefined;
  };

  const onSubmit = useCallback(
    async (values: {
      uuid: string | undefined;
      type: string;
      name: string;
      description: string;
    }) => {
      if (!uuid) {
        await GeoDatabaseTable.createResource({
          ...values,
          type,
          items: [],
          version: 1,
          createdAt: Date.now(),
        });
      } else {
        await GeoDatabaseTable.updateResource(uuid, {
          ...values,
        });
      }
    },
    [type, uuid],
  );

  return (
    <GeoDatabaseEntityUpsertDialog
      uuid={uuid}
      tableType={GeoDatabaseTableTypes.resources}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
