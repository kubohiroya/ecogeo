import { GeoRegionSource } from './GeoRegionSource';
import { MortonNumbers } from './MortonNumbers';

export interface GeoRegionEntity extends GeoRegionSource, MortonNumbers {
  id?: number;
  gid_0?: string;
  gid_1?: string;
  gid_2?: string;
}
