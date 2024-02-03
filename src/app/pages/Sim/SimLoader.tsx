import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { atom, WritableAtom } from 'jotai/index';
import { UIState } from '../../models/UIState';
import { SessionState } from '../../models/SessionState';
import { AppMatrices } from '../../models/AppMatrices';
import {
  createInitialUndoRedoState,
  UndoRedoState,
} from '../../hooks/useUndoRedo';
import { ChartTypes } from '../../models/ChartType';
import { atomWithImmer } from 'jotai-immer';
import { Draft, enablePatches } from 'immer';
import { updateAddedSubGraph } from '../../components/SessionPanel/MapPanel/GraphHandlers';
import { ProjectTypes } from '../../services/database/ProjectType';
import { LoaderFunctionArgs } from 'react-router-dom';
import { DEFAULT_PARAMS_BY_CASE } from '../../models/DefaultParamByCase';
import { PrimitiveAtom } from 'jotai';

enablePatches();

export type SessionStateAtom = WritableAtom<
  UndoRedoState<SessionState>,
  [
    | UndoRedoState<SessionState>
    | ((draft: Draft<UndoRedoState<SessionState>>) => void),
  ],
  void
>;
export type UIStateAtom = PrimitiveAtom<UIState>;
export type MatricesAtom = PrimitiveAtom<AppMatrices>;

export type SimLoaderResult = {
  type: string;
  uuid: string;
  x: number;
  y: number;
  zoom: number;
};

const hash = window.location.hash;
const type = hash.startsWith('/' + ProjectTypes.Racetrack)
  ? ProjectTypes.Racetrack
  : hash.startsWith('/' + ProjectTypes.Graph)
    ? ProjectTypes.Graph
    : hash.startsWith('/' + ProjectTypes.RealWorld)
      ? ProjectTypes.RealWorld
      : ProjectTypes.Racetrack;

const parameterSet = DEFAULT_PARAMS_BY_CASE[type][0];

const graph = updateAddedSubGraph(
  {
    parameterSet,
    locations: [],
    edges: [],
    locationSerialNumber: 0,
  },
  [],
  parameterSet.numLocations,
);

const initialSessionState: SessionState = {
  parameterSet,
  locations: graph.locations,
  edges: graph.edges,
  locationSerialNumber: graph.locationSerialNumber,
};

const initialUndoRedoSessionState =
  createInitialUndoRedoState(initialSessionState);

export const sessionStateAtom = atomWithImmer(initialUndoRedoSessionState);

export const matricesAtom = atom<AppMatrices>({
  adjacencyMatrix: [],
  distanceMatrix: [],
  predecessorMatrix: [],
  transportationCostMatrix: [],
});

export const uiStateAtom = atom<UIState>({
  viewportCenter: [1, 0, 0],
  focusedIndices: [],
  selectedIndices: [],
  draggingIndex: null,
  chartScale: 1,
  chartType: ChartTypes.ManufactureShare,
  autoLayoutFinished: true,
});

export const SimLoader = async function (
  request: LoaderFunctionArgs<{
    params: {
      projectType: string;
      uuid: string;
      zoom: string;
      y: string;
      x: string;
    };
  }>,
): Promise<SimLoaderResult> {
  /*
  const pathname = request.context.;
  const type = pathname.startsWith('/' + ProjectTypes.realWorld)
    ? ProjectTypes.realWorld
    : pathname.startsWith('/' + ProjectTypes.racetrack)
      ? ProjectTypes.racetrack
      : pathname.startsWith('/' + ProjectTypes.graph)
        ? ProjectTypes.graph
        : undefined;
  if (!type) {
    throw new Error('Invalid project type ' + pathname);
  }
   */
  const type = request.params.projectType!;
  const uuid = request.params.uuid!;
  const zoom = parseFloat(request.params.zoom!);
  const y = parseFloat(request.params.y!);
  const x = parseFloat(request.params.x!);

  const t =
    type === 'Racetrack'
      ? ProjectTypes.Racetrack
      : type === 'RealWorld'
        ? ProjectTypes.RealWorld
        : type === 'Graph'
          ? ProjectTypes.Graph
          : ProjectTypes.Graph;

  return {
    uuid,
    type,
    y,
    x,
    zoom,
  };
};
