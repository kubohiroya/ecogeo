import { Country } from './Country';
import { City } from './City';
import { Edge } from './Graph';

export type SessionState = {
  locationSerialNumber: number;
  country: Country;
  locations: City[];
  edges: Edge[];
  units: 'kilometers' | 'degrees';
};
