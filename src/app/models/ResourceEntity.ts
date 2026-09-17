import { GeoDatabaseEntity } from './GeoDatabaseEntity';
import { ResourceItem } from '~/app/models/ResourceItem';

export type ResourceEntity =
  | GADMGeoJsonResourceEntity
  | MapTileResourceEntity
  | IdeGsmCitiesResourceEntity
  | IdeGsmRoutesResourceEntity;

export type GADMGeoJsonResourceEntity = GeoDatabaseEntity & {
  items: ResourceItem[];
};
export type MapTileResourceEntity = GeoDatabaseEntity & {
  mapName: string;
  apiKey: string;
};
export type IdeGsmCitiesResourceEntity = GeoDatabaseEntity;
export type IdeGsmRoutesResourceEntity = GeoDatabaseEntity;
