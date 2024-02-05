import { GeoDatabase } from '../database/GeoDatabase';

export type FileLoaderHandler<T> = {
  check: (headerLine: string) => boolean;
  createEntity: (db: GeoDatabase, line: string) => Promise<T | null>;
  bulkAddEntity: (db: GeoDatabase, entityItemBuffer: T[]) => Promise<void>;
};