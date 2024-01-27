import { GeoDatabaseType } from './GeoDatabaseType';

export interface GeoDatabaseSource {
  type: GeoDatabaseType;
  name: string;
  description: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
