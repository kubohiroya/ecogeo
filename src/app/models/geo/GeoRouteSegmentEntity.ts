import { GeoRouteSegmentSource } from './GeoRouteSegmentSource';
import { MortonNumbers } from './MortonNumbers';

export interface GeoRouteSegmentEntity
  extends GeoRouteSegmentSource,
    MortonNumbers {
  uuid: string;
  sourceIdRef: string;
  targetIdRef: string;
}
