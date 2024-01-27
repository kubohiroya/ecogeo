import { GeoPointEntity } from '../../models/geo/GeoPointEntity';
import { GeoRegionEntity } from '../../models/geo/GeoRegionEntity';
import { GeoRouteSegmentEntity } from '../../models/geo/GeoRouteSegmentEntity';

export type GeoResponsePayload = {
  points: GeoPointEntity[];
  polygons: GeoRegionEntity[][][];
  lines: GeoRouteSegmentEntity[];
};
