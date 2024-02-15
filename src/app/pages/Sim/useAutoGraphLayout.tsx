import { AppMatrices } from '~/app/models/AppMatrices';
import { SessionState } from '~/app/models/SessionState';
import { UIState } from '~/app/models/UIState';
import { City } from '~/app/models/City';
import { Edge } from '~/app/models/Graph';

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
