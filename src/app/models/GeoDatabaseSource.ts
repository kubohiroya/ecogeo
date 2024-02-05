import { ProjectType } from './ProjectType';
import { ResourceType } from './ResourceType';

export interface GeoDatabaseSource {
  type: ProjectType | ResourceType;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}
