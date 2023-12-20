export interface Country {
  /* a country has her locations in this vector */
  countryId: string;
  title: string;
  description: string;

  type: string;
  numLocations: number;

  /*  ratio of workers */
  manufactureShare: number;

  /* maximum transport cost between ach pair of cities */
  transportationCost: number;

  /* elasticity of substitution */
  elasticitySubstitution: number;
}
