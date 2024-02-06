import { useGeolocated } from 'react-geolocated';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { useCallback } from 'react';
import { UpsertDatabaseEntityDialog } from '../DatabaseItemMenu/UpsertDatabaseEntityDialog';
import { useLoaderData } from 'react-router-dom';
import { INITIAL_VIEW_STATE } from '../../Constants';
import { GeoDatabaseTableTypes } from '../../services/database/GeoDatabaseTableType';

export const UpsertProjectDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: string;
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
      type: string;
      name: string;
      description: string;
    }) => {
      if (!uuid) {
        const viewportCenter: [number, number, number] =
          type === 'RealWorld' ? [zoom, latitude, longitude] : [1, 0, 0];

        await GeoDatabaseTable.createProject({
          ...value,
          type,
          viewportCenter,
          version: 1,
          createdAt: Date.now(),
        });
      } else {
        await GeoDatabaseTable.updateProject(uuid, {
          ...value,
        });
      }
    },
    [latitude, longitude, type, uuid, zoom],
  );

  return (
    <UpsertDatabaseEntityDialog
      uuid={uuid}
      tableType={GeoDatabaseTableTypes.projects}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
