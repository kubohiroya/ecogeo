import { GeoDatabaseEntity } from './GeoDatabaseEntity';
import { ResourceItem } from '~/app/models/ResourceItem';

export type ResourceEntity = GeoDatabaseEntity & {
  items: ResourceItem[];
};
