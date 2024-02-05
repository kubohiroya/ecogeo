import { GeoDatabaseSource } from './GeoDatabaseSource';

export interface GeoDatabaseEntity extends GeoDatabaseSource {
  id?: number;
  uuid: string;
}
