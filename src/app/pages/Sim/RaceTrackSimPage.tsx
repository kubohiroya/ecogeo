import React, { useCallback, useEffect, useRef } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { City } from '../../models/City';
import { Edge } from '../../models/Graph';
import { SessionState } from '../../models/SessionState';
import { enablePatches } from 'immer';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { AppMatrices } from '../../models/AppMatrices';
import { useLoaderData } from 'react-router-dom';
import {
  matricesAtom,
  RaceTrackSimLoader,
  uiStateAtom,
  undoRedoSessionStateAtom,
} from './RaceTrackSimLoader';
import { useImmerAtom } from 'jotai-immer';
import { useAtom, useAtomValue } from 'jotai';
import { preferencesAtom } from '../../models/AppPreference';
import { DiagonalMatrixSetPanelHandle } from '../../components/SessionPanel/MatrixSetPanel/MatrixSetPanel';
import { startSimulation, tickSimulator } from '../../models/Simulator';
import { CASE_ARRAY } from '../../models/CaseArray';
import { ParameterSet } from '../../models/ParameterSet';
import { useMatrixEngine } from './useMatrixEngine';
import { RaceTrackDesktopComponent } from './RaceTrackDesktopComponent';
import { useRaceTrackSimulator } from './useRaceTrackSimulator';

enablePatches();

export const RaceTrackSimPage = () => {
  const { uuid, x, y, zoom } = useLoaderData() as RaceTrackSimLoader;

  const {
    set: setSessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    current: sessionState,
    history,
    future,
    staging,
  } = useUndoRedo<SessionState>(undoRedoSessionStateAtom);

  const [uiState, setUIState] = useImmerAtom(uiStateAtom);
  const preferences = useAtomValue(preferencesAtom);
  const [matrices, setMatrices] = useAtom(matricesAtom);

  const diagonalMatrixSetPanelRef = useRef<DiagonalMatrixSetPanelHandle>(null);

  const resetSimulation = (draft: SessionState) => {
    draft.locations.forEach((city) => resetCity(city, draft.locations.length));
  };

  const tickSimulation = (draft: SessionState) => {
    tickSimulator(draft, matrices.transportationCostMatrix!);
  };

  const simulation = useRaceTrackSimulator({
    setSessionState,
    startSimulation,
    resetSimulation,
    tickSimulation,
  });

  function resetCity(city: City, numLocations: number) {
    // FIXME!
    throw new Error('Not implemented yet!');
  }

  const updateCountryInSessionState = useCallback((countryId: string) => {
    // call from the Parameter panel
    setSessionState(
      (draft) => {
        const selectedCountry = CASE_ARRAY.find(
          (c: ParameterSet) => c.caseId === countryId,
        );
        if (selectedCountry) {
          draft.parameterSet = { ...selectedCountry };
        }
        return draft;
      },
      true,
      'setCountry',
    );
    // FIXME!
  }, []);

  const matrixEngine = useMatrixEngine(
    sessionState?.locations?.length,
    sessionState?.edges?.length,
  );

  const updateMatrices = (
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<AppMatrices> => {
    if (!matrixEngine) throw new Error();
    return matrixEngine.updateAdjacencyMatrix(
      locations,
      edges,
      transportationCost,
    );
  };

  const updateAndSetMatrices = (locations: City[], edges: Edge[]) => {
    sessionState &&
      updateMatrices(
        locations,
        edges,
        sessionState.parameterSet.transportationCost,
      ).then((newMatrices) => {
        setMatrices({
          adjacencyMatrix: newMatrices.adjacencyMatrix,
          distanceMatrix: newMatrices.distanceMatrix,
          predecessorMatrix: newMatrices.predecessorMatrix,
          transportationCostMatrix: newMatrices.transportationCostMatrix,
        });
      });
  };

  useEffect(() => {
    updateAndSetMatrices(sessionState?.locations, sessionState?.edges);
  }, [
    sessionState?.locations,
    sessionState?.edges,
    sessionState?.parameterSet?.transportationCost,
  ]);

  useEffect(() => {
    if (sessionState?.parameterSet?.title) {
      document.title = `GEO-ECO - ${sessionState?.parameterSet?.title}`;
    } else {
      document.title = `GEO-ECO: Geological Economics Modeling Simulator`;
    }
  }, [sessionState?.parameterSet?.title]);

  return (
    <RaceTrackDesktopComponent
      {...{
        sessionState,
        setSessionState,
        undoSessionState,
        redoSessionState,
        history,
        future,
        staging,
        simulation,
        matrices,
        setMatrices,
        uiState,
        setUIState,
        preferences,
        updateMatrices,
        updateAndSetMatrices,
      }}
    />
  );
};
