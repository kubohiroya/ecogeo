import { useGeolocated } from 'react-geolocated';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { useCallback } from 'react';
import { UpsertProjectDialog } from './UpsertProjectDialog';
import { useLoaderData } from 'react-router-dom';
import { GeoDatabaseType } from '../../services/database/GeoDatabaseType';
import { INITIAL_VIEW_STATE } from '../../Constants';

export const UpsertGeoProjectDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: GeoDatabaseType;
    name: string | undefined;
    description: string | undefined;
  };

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
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
      type: GeoDatabaseType;
      name: string;
      description: string;
    }) => {
      if (!uuid) {
        await GeoDatabaseTable.createDatabase({
          ...value,
          type,
          version: 1,
          createdAt: Date.now(),
          coordinate: [latitude, longitude],
          zoom,
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
    <UpsertProjectDialog
      uuid={uuid}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
