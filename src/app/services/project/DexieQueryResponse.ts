import { GeoPointEntity } from '../../models/geo/GeoPointEntity';
import { GeoRegionEntity } from '../../models/geo/GeoRegionEntity';
import { GeoRouteSegmentEntity } from '../../models/geo/GeoRouteSegmentEntity';

export type DexieQueryResponse = {
  payload: {
    points: GeoPointEntity[];
    polygons: GeoRegionEntity[][][];
    lines: GeoRouteSegmentEntity[];
  };
};
