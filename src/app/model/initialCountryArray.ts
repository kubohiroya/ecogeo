import { Country } from './Country';

const params = new URLSearchParams(location.search);
const numLocations = parseInt(params.get('K') || '17');
const pi = parseFloat(params.get('pi') || '0.2');
const tau = parseFloat(params.get('tau') || '2');
const sigma = parseFloat(params.get('sigma') || '4');

export const INITIAL_COUNTRY_ARRAY: Country[] = [
  {
    countryId: '0000',
    title: 'Base case',
    description:
      'Base case (K=12, π=0.2, τ=2, σ=4). All workers usually end up in several(one or more) concentrations.',
    type: 'RaceTrack',
    numLocations: 12,
    manufactureShare: 0.2,
    transportationCost: 2,
    elasticitySubstitution: 4,
  },
  {
    countryId: '1111',
    title: 'Case i',
    description:
      'Less differentiated products (K=12, π=0.2, τ=2, σ=2). In this case (in which firms have more market power, and in which the equilibrium degree of scale economies is also larger), all runs produced only a single location.',
    type: 'RaceTrack',
    numLocations: 12,
    manufactureShare: 0.2,
    transportationCost: 2,
    elasticitySubstitution: 2,
  },
  {
    countryId: '2222',
    title: 'Case ii',
    description:
      'A larger manufacturing share (K=12, π=0.4, τ=2, σ=4). In this case, in which one would expect the backward and forward linkages driving agglomeration to be stronger, we also consistently get only a single location.',
    type: 'RaceTrack',
    numLocations: 12,
    manufactureShare: 0.4,
    transportationCost: 2,
    elasticitySubstitution: 4,
  },
  {
    countryId: '3333',
    title: 'Case iii',
    description:
      'Lower transport costs (K=12, π=0.2, τ=1, σ=4). In this case we would expect there to be less incentive to set up multiple urban centers, and again all ten runs produce only a single location.',
    type: 'RaceTrack',
    numLocations: 12,
    manufactureShare: 0.2,
    transportationCost: 1,
    elasticitySubstitution: 4,
  },
  {
    countryId: '',
    title: 'Custom',
    description: 'User defined custom case.',
    type: 'Graph',
    numLocations: numLocations,
    manufactureShare: pi,
    transportationCost: tau,
    elasticitySubstitution: sigma,
  },
  {
    countryId: '999',
    title: 'test',
    description:
      'Base case (K=12, π=0.2, τ=2, σ=4). All workers usually end up in several(one or more) concentrations.',
    type: 'RaceTrack',
    numLocations: 4,
    manufactureShare: 0.2,
    transportationCost: 2,
    elasticitySubstitution: 4,
  },
];
