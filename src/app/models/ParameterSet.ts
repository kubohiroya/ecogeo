import { ProjectType } from './ProjectType';

export interface ParameterSet {
  /* a country has her locations in this vector */
  caseId: string;
  title: string;
  description: string;

  type: ProjectType;
  numLocations: number;

  /*  ratio of workers */
  manufactureShare: number;

  /* maximum transport cost between ach pair of cities */
  transportationCost: number;

  /* elasticity of substitution */
  elasticitySubstitution: number;

  units: 'kilometers' | 'degrees';
}
