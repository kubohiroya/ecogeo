import { useGeolocated } from 'react-geolocated';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { useCallback } from 'react';
import { UpsertDatabaseItemDialog } from '../DatabaseItemMenu/UpsertDatabaseItemDialog';
import { useLoaderData } from 'react-router-dom';
import { ProjectType } from '../../services/database/ProjectType';
import { INITIAL_VIEW_STATE } from '../../Constants';
import { ResourceType } from '../../models/ResourceEntity';

export const UpsertGeoProjectDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: ProjectType | ResourceType;
    name: string | undefined;
    description: string | undefined;
  };

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const { latitude, longitude, zoom } = {
    latitude: coords?.latitude || INITIAL_VIEW_STATE.latitude,
    longitude: coords?.longitude || INITIAL_VIEW_STATE.longitude,
    zoom: INITIAL_VIEW_STATE.zoom,
  };

  const onSubmit = useCallback(
    async (value: {
      uuid: string | undefined;
      type: ProjectType | ResourceType;
      name: string;
      description: string;
    }) => {
      if (!uuid) {
        await GeoDatabaseTable.createDatabase({
          ...value,
          type,
          urls: [],
          version: 1,
          createdAt: Date.now(),
          viewportCenter: [zoom, latitude, longitude],
        });
      } else {
        await GeoDatabaseTable.updateDatabase(uuid, {
          ...value,
        });
      }
    },
    [],
  );

  return (
    <UpsertDatabaseItemDialog
      uuid={uuid}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
