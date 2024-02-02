import { ParameterSet } from './ParameterSet';
import { ProjectType, ProjectTypes } from '../services/database/ProjectType';

/*
const params = new URLSearchParams(location.search);
const numLocations = parseInt(params.get('K') || '17');
const pi = parseFloat(params.get('pi') || '0.2');
const tau = parseFloat(params.get('tau') || '2');
const sigma = parseFloat(params.get('sigma') || '4');
*/

export const DEFAULT_PARAMS_BY_CASE: Record<ProjectType, ParameterSet[]> = {
  [ProjectTypes.Racetrack]: [
    {
      caseId: 'Racetrack-0',
      title: 'Base case',
      description:
        'Base case (K=12, π=0.2, τ=2, σ=4). All workers usually end up in several(one or more) concentrations.',
      type: 'Racetrack',
      numLocations: 12,
      manufactureShare: 0.2,
      transportationCost: 2,
      elasticitySubstitution: 4,
      units: 'kilometers',
    },
    {
      caseId: 'Racetrack-1',
      title: 'Case i',
      description:
        'Less differentiated products (K=12, π=0.2, τ=2, σ=2). In this case (in which firms have more market power, and in which the equilibrium degree of scale economies is also larger), all runs produced only a single location.',
      type: 'Racetrack',
      numLocations: 12,
      manufactureShare: 0.2,
      transportationCost: 2,
      elasticitySubstitution: 2,
      units: 'kilometers',
    },
    {
      caseId: 'Racetrack-2',
      title: 'Case ii',
      description:
        'A larger manufacturing share (K=12, π=0.4, τ=2, σ=4). In this case, in which one would expect the backward and forward linkages driving agglomeration to be stronger, we also consistently get only a single location.',
      type: 'Racetrack',
      numLocations: 12,
      manufactureShare: 0.4,
      transportationCost: 2,
      elasticitySubstitution: 4,
      units: 'kilometers',
    },
    {
      caseId: 'Racetrack-3',
      title: 'Case iii',
      description:
        'Lower transport costs (K=12, π=0.2, τ=1, σ=4). In this case we would expect there to be less incentive to set up multiple urban centers, and again all ten runs produce only a single location.',
      type: 'Racetrack',
      numLocations: 12,
      manufactureShare: 0.2,
      transportationCost: 1,
      elasticitySubstitution: 4,
      units: 'kilometers',
    },
  ],
  [ProjectTypes.Graph]: [
    {
      caseId: 'Graph-0',
      title: 'Base case',
      description:
        'Base case (K=12, π=0.2, τ=2, σ=4). All workers usually end up in several(one or more) concentrations.',
      type: 'Graph',
      numLocations: 12,
      manufactureShare: 0.2,
      transportationCost: 2,
      elasticitySubstitution: 4,
      units: 'kilometers',
    },
    {
      caseId: 'Graph-1',
      title: 'Case A',
      description:
        'Less differentiated products (K=12, π=0.2, τ=2, σ=2). In this case (in which firms have more market power, and in which the equilibrium degree of scale economies is also larger), all runs produced only a single location.',
      type: 'Graph',
      numLocations: 12,
      manufactureShare: 0.2,
      transportationCost: 2,
      elasticitySubstitution: 2,
      units: 'kilometers',
    },
    {
      caseId: 'Graph-2',
      title: 'Case B',
      description:
        'A larger manufacturing share (K=12, π=0.4, τ=2, σ=4). In this case, in which one would expect the backward and forward linkages driving agglomeration to be stronger, we also consistently get only a single location.',
      type: 'Graph',
      numLocations: 12,
      manufactureShare: 0.4,
      transportationCost: 2,
      elasticitySubstitution: 4,
      units: 'kilometers',
    },
    {
      caseId: 'Graph-3',
      title: 'Case C',
      description:
        'Lower transport costs (K=12, π=0.2, τ=1, σ=4). In this case we would expect there to be less incentive to set up multiple urban centers, and again all ten runs produce only a single location.',
      type: 'Graph',
      numLocations: 12,
      manufactureShare: 0.2,
      transportationCost: 1,
      elasticitySubstitution: 4,
      units: 'kilometers',
    },
  ],
  [ProjectTypes.RealWorld]: [
    {
      caseId: 'RealWorld-0',
      title: 'IDE-GSM 0',
      description: 'sample 0',
      type: 'RealWorld',
      numLocations: 4,
      manufactureShare: 0.2,
      transportationCost: 2,
      elasticitySubstitution: 4,
      units: 'degrees',
    },
    {
      caseId: 'RealWorld-1',
      title: 'IDE-GSM 1',
      description: 'sample 1',
      type: 'RealWorld',
      numLocations: 10,
      manufactureShare: 0.2,
      transportationCost: 2,
      elasticitySubstitution: 4,
      units: 'degrees',
    },
  ],
};
