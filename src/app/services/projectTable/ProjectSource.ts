import { ProjectType } from '../../models/ProjectType';

export interface ProjectSource {
  type: ProjectType;
  name: string;
  description: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
