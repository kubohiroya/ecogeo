import { AppMatrices } from '../../models/AppMatrices';
import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { City } from '../../models/City';
import { Edge } from '../../models/Graph';

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
