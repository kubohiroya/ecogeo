import { GeoDatabaseEntity } from './GeoDatabaseEntity';
import { ResourceItem } from 'src/app/models/ResourceItem';

export type ResourceEntity = GeoDatabaseEntity & {
  items: ResourceItem[];
};
