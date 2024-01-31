import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { atom } from 'jotai/index';
import { UIState } from '../../models/UIState';
import { SessionState } from '../../models/SessionState';
import { AppMatrices } from '../../models/AppMatrices';
import {
  createInitialUndoRedoState,
  UndoRedoState,
} from '../../hooks/useUndoRedo';
import { CASE_ARRAY } from '../../models/CaseArray';
import { ChartType } from '../../models/ChartType';
import { atomWithImmer } from 'jotai-immer';
import { enablePatches } from 'immer';
import { updateAddedSubGraph } from '../../components/SessionPanel/MapPanel/GraphHandlers';
import { ProjectType } from '../../services/database/ProjectType';
import { LoaderFunctionArgs } from 'react-router-dom';

enablePatches();

const NUM_HORIZONTAL_GRIDS = 32;
const NUM_VERTICAL_GRIDS = 20;
//const graph = updateRaceTrackSubGraph(initialSessionState, numLocations);

export type UndoRedoSessionState = UndoRedoState<SessionState>;

const country = CASE_ARRAY[0];

const graph = updateAddedSubGraph(
  {
    parameterSet: country,
    locations: [],
    edges: [],
    locationSerialNumber: 0,
  },
  [],
  country.numLocations,
);

const initialSessionState: SessionState = {
  parameterSet: country,
  locations: graph.locations,
  edges: graph.edges,
  locationSerialNumber: graph.locationSerialNumber,
};

const initialUndoRedoSessionState =
  createInitialUndoRedoState(initialSessionState);
export const undoRedoSessionStateAtom = atomWithImmer(
  initialUndoRedoSessionState,
);

export const matricesAtom = atom<AppMatrices>({
  adjacencyMatrix: [],
  distanceMatrix: [],
  predecessorMatrix: [],
  transportationCostMatrix: [],
});

export const uiStateAtom = atom<UIState>({
  viewportCenter: null,
  focusedIndices: [],
  selectedIndices: [],
  draggingIndex: null,
  chartScale: 1,
  chartType: ChartType.ManufactureShare,
  autoLayoutFinished: true,
});

export type SimLoaderResult = {
  type: ProjectType;
  uuid: string;
  x: number;
  y: number;
  zoom: number;
};

export async function SimLoader(
  request: LoaderFunctionArgs<{
    params: {
      type: ProjectType;
      uuid: string;
      zoom: string;
      y: string;
      x: string;
    };
  }>,
): Promise<{
  type: string;
  uuid: string;
  y: number;
  x: number;
  zoom: number;
}> {
  const type = request.params.type!;
  const uuid = request.params.uuid!;
  const zoom = parseFloat(request.params.zoom!);
  const y = parseFloat(request.params.y!);
  const x = parseFloat(request.params.x!);
  // projectDB: await GeoDatabase.open(request.params.uuid),
  return {
    type,
    uuid,
    y,
    x,
    zoom,
  };
}