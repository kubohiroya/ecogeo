import { ProjectSource } from './ProjectSource';

export interface ProjectEntity extends ProjectSource {
  id?: number;
  uuid: string;
  coordinate: [number, number];
  zoom: number;
}
