import { UIState } from './UIState';
import { AppTimer } from './AppTimer';
import { AppMatrices } from './AppMatrices';

export type Session = {
  sessionId: string;

  matrices: AppMatrices;

  timers: {
    autoGraphLayoutTimer: AppTimer;
    simulationTimer: AppTimer;
  };

  uiState: UIState;
};
