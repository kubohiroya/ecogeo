import { useGeolocated } from 'react-geolocated';
import { ProjectTableDB } from '../../services/projectTable/ProjectTableDB';
import { useCallback } from 'react';
import { UpsertProjectDialog } from './UpsertProjectDialog';
import { useLoaderData } from 'react-router-dom';
import { ProjectType } from '../ProjectIndex/ProjectType';
import { INITIAL_VIEW_STATE } from '../../Constants';

export const UpsertGeoProjectDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: ProjectType;
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
      type: ProjectType;
      name: string;
      description: string;
    }) => {
      if (!uuid) {
        await ProjectTableDB.createProject({
          ...value,
          type,
          version: 1,
          createdAt: Date.now(),
          coordinate: [latitude, longitude],
          zoom,
        });
      } else {
        await ProjectTableDB.updateProject(uuid, {
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
