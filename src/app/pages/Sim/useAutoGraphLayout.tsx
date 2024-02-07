import { AppMatrices } from 'src/app/models/AppMatrices';
import { SessionState } from 'src/app/models/SessionState';
import { UIState } from 'src/app/models/UIState';
import { City } from 'src/app/models/City';
import { Edge } from 'src/app/models/Graph';

const useAutoGraphLayout = ({
  matrices,
  sessionState,
  setSessionState,
  uiState,
  updateAndSetMatrices,
}: {
  matrices: AppMatrices;
  sessionState: SessionState;
  setSessionState: (
    func: (draft: SessionState) => void,
    commit?: boolean,
    label?: string,
  ) => void;
  uiState: UIState;
  updateAndSetMatrices: (locations: City[], edges: Edge[]) => void;
}) => {};

const RaceTrackSimulatorCore = () => {};
