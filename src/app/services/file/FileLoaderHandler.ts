import { ProjectDB } from '../project/ProjectDB';

export type FileLoaderHandler<T> = {
  check: (headerLine: string) => boolean;
  createEntity: (db: ProjectDB, line: string) => Promise<T | null>;
  bulkAddEntity: (db: ProjectDB, entityItemBuffer: T[]) => Promise<void>;
};
