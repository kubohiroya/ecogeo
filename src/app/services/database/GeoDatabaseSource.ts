import { ProjectType } from './ProjectType';
import { ResourceType } from '../../models/ResourceEntity';

export interface GeoDatabaseSource {
  type: ProjectType | ResourceType;
  name: string;
  description: string;
  urls: string[];
  createdAt: number;
  updatedAt: number;
}
