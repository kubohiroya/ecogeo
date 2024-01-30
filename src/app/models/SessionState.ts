import { ParameterSet } from './ParameterSet';
import { City } from './City';
import { Edge } from './Graph';

export type SessionState = {
  locationSerialNumber: number;
  parameterSet: ParameterSet;
  locations: City[];
  edges: Edge[];
};
