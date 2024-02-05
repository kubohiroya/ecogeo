import { GeoPointEntity } from './geo/GeoPointEntity';
import { GeoRegionEntity } from './geo/GeoRegionEntity';
import { GeoRouteSegmentEntity } from './geo/GeoRouteSegmentEntity';

export type GeoResponsePayload = {
  points: GeoPointEntity[];
  polygons: GeoRegionEntity[][][];
  lines: GeoRouteSegmentEntity[];
};
