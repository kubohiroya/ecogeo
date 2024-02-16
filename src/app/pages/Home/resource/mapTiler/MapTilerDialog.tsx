import { useLoaderData } from 'react-router-dom';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import React, { useCallback } from 'react';
import { GeoDatabaseEntityUpsertDialog } from '~/app/pages/Home/GeoDatabaseEntityUpsertDialog';
import { MapTilerDialogContent } from '~/app/pages/Home/resource/mapTiler/MapTilerDialogContent';

export const MapTilerDialog = () => {
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
      formData: FormData;
    }) => {
      const formJson = Object.fromEntries(
        (values.formData as any).entries(),
      ) as {
        name: string;
        description: string;
      };

      if (!uuid) {
        await GeoDatabaseTable.createResource({
          ...formJson,
          type,
          items: [],
          version: 1,
          createdAt: Date.now(),
        });
      } else {
        await GeoDatabaseTable.updateResource(uuid, {
          ...formJson,
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
      onSubmit={onSubmit}
    >
      <MapTilerDialogContent name={name} description={description} />
    </GeoDatabaseEntityUpsertDialog>
  );
};
