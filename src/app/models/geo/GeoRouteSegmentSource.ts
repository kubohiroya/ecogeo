import { GeoRouteSegmentMode } from './GeoRouteSegmentMode';

export interface GeoRouteSegmentSource {
  mode: GeoRouteSegmentMode;
  name: string;
  sourceCountry: string;
  sourceName1: string;
  sourceName2: string;
  sourceName: string;
  targetCountry: string;
  targetName1: string;
  targetName2: string;
  targetName: string;
}
