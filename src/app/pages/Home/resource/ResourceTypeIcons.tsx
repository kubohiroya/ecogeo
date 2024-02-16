import { ResourceTypes } from '~/app/models/ResourceType';
import { Flag, LocationCity, Place, Route } from '@mui/icons-material';
import React from 'react';

export const resourceTypeIcons = {
  [ResourceTypes.mapTiler]: <Place />,
  [ResourceTypes.gadmGeoJson]: <Flag />,
  [ResourceTypes.idegsmCities]: <LocationCity />,
  [ResourceTypes.idegsmRoutes]: <Route />,
};
