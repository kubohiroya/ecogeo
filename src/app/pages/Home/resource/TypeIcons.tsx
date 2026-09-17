import { ResourceTypes } from '~/app/models/ResourceType';
import {
  Flag,
  Map,
  LocationCity,
  PanoramaFishEye,
  Public,
  Route,
  Share,
} from '@mui/icons-material';
import React from 'react';
import { MapSvgIcon } from '~/components/SvgIcon/MapSvgIcon';
import { ProjectTypes } from '~/app/models/ProjectType';

export const TypeIcons = {
  [ResourceTypes.mapTiles]: <Map />,
  [ResourceTypes.gadmGeoJson]: <Flag />,
  [ResourceTypes.genericGeoJson]: <MapSvgIcon />,
  [ResourceTypes.idegsmCities]: <LocationCity />,
  [ResourceTypes.idegsmRoutes]: <Route />,
  [ProjectTypes.RealWorld]: <Public />,
  [ProjectTypes.Graph]: <Share />,
  [ProjectTypes.Racetrack]: <PanoramaFishEye />,
};
