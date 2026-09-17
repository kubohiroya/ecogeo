import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import React, { useCallback, useState } from 'react';
import { GeoDatabaseEntityUpsertDialog } from '~/app/pages/Home/GeoDatabaseEntityUpsertDialog';
import { MapTileDialogContent } from '~/app/pages/Home/resource/mapTile/MapTileDialogContent';
import { ResourceTypes } from '~/app/models/ResourceType';

export const MapTileDialog = () => {
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

      if (!values.uuid) {
        await GeoDatabaseTable.createResource({
          ...formJson,
          type: ResourceTypes.mapTiles,
          items: [],
          version: 1,
          createdAt: Date.now(),
        });
      } else {
        await GeoDatabaseTable.updateResource(values.uuid, {
          ...formJson,
        });
      }
    },
    [],
  );

  const [name, setName] = useState<string>('');

  GeoDatabaseTable.getSingleton()
    .resources.where('type')
    .equals(ResourceTypes.mapTiles)
    .sortBy('updatedAt')
    .then((resources) => {
      const id =
        resources.length === 0
          ? 1
          : parseInt(resources[resources.length - 1].name.split('#')[1]) + 1;
      setName(`MapTiler Cloud API Key #${id}`);
    });

  if (name === '') {
    return null;
  }

  return (
    <GeoDatabaseEntityUpsertDialog
      uuid={undefined}
      tableType={GeoDatabaseTableTypes.resources}
      type={ResourceTypes.mapTiles}
      onSubmit={onSubmit}
    >
      <MapTileDialogContent
        name={name}
        mapName={'openstreetmap'}
        description={''}
        apiKey={''}
      />
    </GeoDatabaseEntityUpsertDialog>
  );
};
