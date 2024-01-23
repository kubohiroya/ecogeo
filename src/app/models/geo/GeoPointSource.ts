import { GeoPointType } from './GeoPointType';

export interface GeoPointSource {
  uuid: string;
  lat: number;
  lng: number;
  country: string;
  name_1: string;
  name_2: string;
  name: string;
  type: GeoPointType;
}
