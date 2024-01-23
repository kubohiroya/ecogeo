import { ProjectType } from '../../pages/ProjectIndex/ProjectType';

export interface ProjectSource {
  type: ProjectType;
  name: string;
  description: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
