import { GeoDatabaseEntity } from './GeoDatabaseEntity';

export type ResourceItems = {
  url: string;
  countryName: string;
  countryCode: string;
  level: number;
};

export type ResourceEntity = GeoDatabaseEntity & {
  items: ResourceItems[];
};
