import { ProjectType } from './ProjectType';

export interface GeoDatabaseSource {
  type: ProjectType;
  name: string;
  description: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
