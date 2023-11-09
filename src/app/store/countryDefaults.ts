import { Country } from '../model/Country';

const params = new URLSearchParams(location.search);
const numRegions = parseInt(params.get('K') || '12');
const pi = parseFloat(params.get('pi') || '0.2');
const tau = parseFloat(params.get('tau') || '2');
const sigma = parseFloat(params.get('sigma') || '4');

export const countryDefaults: Country[] = [
  {
    id: '0000',
    title: 'Base case',
    description:
      'Base case (K=12, π=0.2, τ=2, σ=4). All workers usually end up in several(one or more) concentrations.',
    type: 'RaceTrack',
    numLocations: 12,
    shareManufacturing: 0.2,
    transportationCost: 2,
    elasticitySubstitution: 4,
  },
  {
    id: '1111',
    title: 'Case i',
    description:
      'Less differentiated products (K=12, π=0.2, τ=2, σ=2). In this case (in which firms have more market power, and in which the equilibrium degree of scale economies is also larger), all runs produced only a single region.',
    type: 'RaceTrack',
    numLocations: 12,
    shareManufacturing: 0.2,
    transportationCost: 2,
    elasticitySubstitution: 2,
  },
  {
    id: '2222',
    title: 'Case ii',
    description:
      'A larger manufacturing share (K=12, π=0.4, τ=2, σ=4). In this case, in which one would expect the backward and forward linkages driving agglomeration to be stronger, we also consistently get only a single region.',
    type: 'RaceTrack',
    numLocations: 12,
    shareManufacturing: 0.4,
    transportationCost: 2,
    elasticitySubstitution: 4,
  },
  {
    id: '3333',
    title: 'Case iii',
    description:
      'Lower transport costs (K=12, π=0.2, τ=1, σ=4). In this case we would expect there to be less incentive to set up multiple urban centers, and again all ten runs produce only a single region.',
    type: 'RaceTrack',
    numLocations: 12,
    shareManufacturing: 0.2,
    transportationCost: 1,
    elasticitySubstitution: 4,
  },
  {
    id: '',
    title: 'Custom',
    description: 'User defined custom case.',
    type: 'Graph',
    numLocations: numRegions,
    shareManufacturing: pi,
    transportationCost: tau,
    elasticitySubstitution: sigma,
  },
];
