import { GeoDatabaseEntity } from './GeoDatabaseEntity';

export type ProjectEntity = GeoDatabaseEntity & {
  viewportCenter?: [number, number, number];
};
