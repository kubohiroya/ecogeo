import { DEFAULT_PARAMS_BY_CASE } from 'src/app/models/DefaultParamByCase';
import { ProjectTypes } from 'src/app/models/ProjectType';

const hash = window.location.hash;

export const currentProjectType = hash.startsWith('/' + ProjectTypes.Racetrack)
  ? ProjectTypes.Racetrack
  : hash.startsWith('/' + ProjectTypes.Graph)
    ? ProjectTypes.Graph
    : hash.startsWith('/' + ProjectTypes.RealWorld)
      ? ProjectTypes.RealWorld
      : ProjectTypes.Racetrack;
export const parameterSet = DEFAULT_PARAMS_BY_CASE[currentProjectType][0];
