import { GeoPointSource } from './GeoPointSource';

import { MortonNumbers } from './MortonNumbers';

export interface GeoPointEntity extends GeoPointSource, MortonNumbers {
  id?: number;
}
