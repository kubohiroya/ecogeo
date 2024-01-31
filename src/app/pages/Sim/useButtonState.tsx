import { AppSimulation } from '../../models/AppSimulation';
import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
import { City } from '../../models/City';
import { Edge } from '../../models/Graph';
import { PatchPair } from '../../hooks/useUndoRedo';
import { useCallback, useEffect, useState } from 'react';
import { MapPanelButtonsState } from '../../components/SessionPanel/MapPanel/MapPanelButtonsState';
import { GraphLayoutTickResult } from '../../graphLayout/GraphLayout';
import { calculateDistanceByLocations } from '../../apsp/calculateDistanceByLocations';
import { isSpherical } from '../../models/IsSpherical';
import { useWindowDimensions } from '../../hooks/useWindowDimenstions';
import { useViewportActions } from './useViewportActions';
import useIntervalExpScale from '../../hooks/useIntervalExpScape';
import { SpringGraphLayout } from '../../graphLayout/SpringGraphLayout';

const useGraphPanelButtonState = ({
  simulation,
  sessionState,
  setSessionState,
  uiState,
  setUIState,
  matrices,
  updateAndSetMatrices,
  future,
  autoGraphLayoutEngine,
}: {
  simulation: AppSimulation;
  sessionState: SessionState;
  setSessionState: (
    func: (draft: SessionState) => void,
    commit?: boolean,
    label?: string,
  ) => void;
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
  matrices: AppMatrices;
  updateAndSetMatrices: (locations: City[], edges: Edge[]) => void;
  future: PatchPair[];
  autoGraphLayoutEngine: SpringGraphLayout;
}) => {
  const [graphPanelButtonState, setGraphPanelButtonState] =
    useState<MapPanelButtonsState>({
      addLocation: false,
      removeLocation: false,
      addEdge: false,
      removeEdge: false,
      autoGraphLayout: true,
      undo: false,
      redo: false,
    });

  const tickAutoGraphLayout = useCallback((): GraphLayoutTickResult => {
    //const tickAutoGraphLayout = (): GraphLayoutTickResult => {
    const graphLayoutTickResult = autoGraphLayoutEngine.tick(
      sessionState.locations,
      sessionState.edges,
      matrices.adjacencyMatrix,
      uiState.selectedIndices,
      uiState.draggingIndex,
    );

    setSessionState(
      (draft) => {
        graphLayoutTickResult.points.forEach((city, index) => {
          draft.locations[index].point[0] = city[0];
          draft.locations[index].point[1] = city[1];
        });
        const idToIndexMap = new Map<number, number>(
          draft.locations.map((city, index) => [city.id, index]),
        );
        draft.edges.forEach((edge, index) => {
          const source = draft.locations[idToIndexMap.get(edge.source)!];
          const target = draft.locations[idToIndexMap.get(edge.target)!];
          draft.edges[index].distance = calculateDistanceByLocations(
            source.point,
            target.point,
            isSpherical(sessionState),
          );
        });
        return draft;
      },
      graphLayoutTickResult.maximumVelocity < 1.0,
      'autoLayout',
    );

    const { width, height } = useWindowDimensions();

    useViewportActions({
      width,
      height,
      locations: sessionState.locations,
      uiState,
      setUIState,
    });

    //

    function startSimulation(sessionState: SessionState) {
      // FIXME!
      throw new Error('Not implemented yet!');
    }

    return graphLayoutTickResult;
  }, [
    setSessionState,
    sessionState,
    sessionState?.locations,
    sessionState?.edges,
    uiState?.selectedIndices,
    uiState?.draggingIndex,
  ]);

  const autoGraphLayoutTimer = useIntervalExpScale<GraphLayoutTickResult>({
    onStarted: () => {},
    onReset: () => {},
    tick: tickAutoGraphLayout,
    isFinished: (result: GraphLayoutTickResult) => {
      return result.maximumVelocity < 0.1;
    },
    onFinished: (result: GraphLayoutTickResult) => {
      updateAndSetMatrices(sessionState.locations, sessionState.edges);
    },
    minInterval: 5,
    maxInterval: 300,
    initialIntervalScale: 0,
  });

  const onToggleAutoGraphLayout = useCallback(() => {
    if (autoGraphLayoutTimer.isStarted) {
      autoGraphLayoutTimer.stop();
    } else if (autoGraphLayoutTimer.intervalScale > 0) {
      autoGraphLayoutTimer.start();
    }
  }, [autoGraphLayoutTimer.isStarted, autoGraphLayoutTimer.intervalScale]);

  const setAutoGraphLayoutIntervalScale = useCallback(
    (intervalScale: number) => {
      autoGraphLayoutTimer.changeIntervalScale(intervalScale);
      if (autoGraphLayoutTimer.intervalScale == 0) {
        autoGraphLayoutTimer.stop();
      } else if (0 < intervalScale) {
        autoGraphLayoutTimer.start();
      }
    },
    [autoGraphLayoutTimer?.isStarted, autoGraphLayoutTimer?.intervalScale],
  );

  useEffect(() => {
    setGraphPanelButtonState({
      addLocation: !simulation.isStarted,
      removeLocation:
        !simulation.isStarted && uiState.selectedIndices.length > 0,
      addEdge: !simulation.isStarted && uiState.selectedIndices.length >= 2,
      removeEdge: !simulation.isStarted && uiState.selectedIndices.length >= 2,
      autoGraphLayout:
        sessionState?.parameterSet?.units == 'kilometers' &&
        !autoGraphLayoutTimer?.isStarted,
      undo: history?.length > 0,
      redo: future?.length > 0,
    });
  }, [autoGraphLayoutTimer, simulation, uiState, history, future]);
};
