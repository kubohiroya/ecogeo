import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, Button } from '@mui/material';
import {
  BarChart,
  Edit,
  Flag,
  FolderOpen,
  GridOn,
  Home,
  Timer,
} from '@mui/icons-material';
import { DesktopComponent } from './DesktopComponent';
import { useLoaderData } from 'react-router-dom';
import { GridItemType } from './GridItemType';
import useWindowDimensions from '../../hooks/useWindowDimenstions';
import { atom, useAtomValue } from 'jotai/index';
import { preferencesAtom } from '../../models/AppPreference';
import { SpringGraphLayout } from '../../graphLayout/SpringGraphLayout';
import { City, resetCity } from '../../models/City';
import { Edge } from '../../models/Graph';
import { GraphLayoutTickResult } from '../../graphLayout/GraphLayout';
import { calculateDistanceByLocations } from '../../apsp/calculateDistanceByLocations';
import useIntervalExpScale from '../../hooks/useIntervalExpScape';
import { startSimulation, tickSimulator } from '../../models/Simulator';
import useHotkeys from '@reecelucas/react-use-hotkeys';
import {
  DiagonalMatrixSetPanelHandle,
  MatrixSetPanel,
} from '../../components/SessionPanel/MatrixSetPanel/MatrixSetPanel';
import { MapPanelButtonsState } from '../../components/SessionPanel/MapPanel/MapPanelButtonsState';
import { arrayXOR, convertIdToIndex } from '../../utils/arrayUtil';
import { globalPixelToTileXYZ } from '../../utils/mortonNumberUtil';
import { UIState } from '../../models/UIState';
import { calcBoundingRect } from '../../components/SessionPanel/MapPanel/calcBoundingRect';
import { createViewportCenter } from '../../components/SessionPanel/MapPanel/CreateViewportCenter';
import { PADDING_MARGIN_RATIO } from '../../components/SessionPanel/MapPanel/Constatns';
import {
  removeSubGraph,
  updateAddedSubGraph,
  updateRandomSubGraph,
} from '../../components/SessionPanel/MapPanel/GraphHandlers';
import { SessionState } from '../../models/SessionState';
import { isInfinity } from '../../utils/mathUtil';
import { AppMatrices } from '../../models/AppMatrices';
import { getMatrixEngine } from '../../apsp/MatrixEngineService';
import { ViewportCenter } from '../../models/ViewportCenter';
import { EuclideanCanvas } from '../../components/SessionPanel/MapPanel/pixi/EuclideanCanvas';
import TimeControlPanel from '../../components/SessionPanel/TimeControPanel/TimeControlPanel';
import CountryConfigPanel from '../../components/SessionPanel/CountryConfigPanel/CountryConfigPanel';
import {
  createInitialUndoRedoState,
  UndoRedoState,
  useUndoRedo,
} from '../../hooks/useUndoRedo';
import { INITIAL_COUNTRY_ARRAY } from '../../models/initialCountryArray';
import { ChartType } from '../../models/ChartType';
import { session } from '../../models/Session';
import { ChartPanel } from '../../components/SessionPanel/ChartPanel/ChartPanel';
import { ChartCanvas } from '../../components/SessionPanel/ChartPanel/ChartCanvas';
import { atomWithImmer, useImmerAtom } from 'jotai-immer';
import { useAtom } from 'jotai';
import { enablePatches } from 'immer';

enablePatches();

const NUM_HORIZONTAL_GRIDS = 32;
const NUM_VERTICAL_GRIDS = 20;

//const graph = updateRaceTrackSubGraph(initialSessionState, numLocations);

const ROW_HEIGHT = 32;

export type UndoRedoSessionState = UndoRedoState<SessionState>;

const initialSessionState: SessionState = {
  country: INITIAL_COUNTRY_ARRAY[0],
  locations: [],
  edges: [],
  locationSerialNumber: 0,
};
const undoRedoSessionState = createInitialUndoRedoState(initialSessionState);
const undoRedoSessionStateAtom = atomWithImmer(undoRedoSessionState);

//const sessionStateAtom = atomWithImmer<SessionState>();

function useUndoRedoSessionState() {
  const {
    set: setSessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    current: sessionState,
    history,
    future,
    staging,
  } = useUndoRedo<SessionState>(undoRedoSessionStateAtom);

  return {
    sessionState,
    setSessionState,
    undoSessionState,
    redoSessionState,
    history,
    staging,
    future,
  };
}

const matricesAtom = atom<AppMatrices>({
  adjacencyMatrix: [],
  distanceMatrix: [],
  predecessorMatrix: [],
  transportationCostMatrix: [],
});

const uiStateAtom = atom<UIState>({
  viewportCenter: null,
  focusedIndices: [],
  selectedIndices: [],
  draggingIndex: null,
  chartScale: 1,
  chartType: ChartType.ManufactureShare,
  autoLayoutFinished: true,
});

export const useSessionStateUndoRedo = () => {
  //const [session, setSession] = useImmerAtom(sessionAtom);

  const {
    setSessionState,
    undoSessionState,
    redoSessionState,
    sessionState,
    history,
    future,
    staging,
  } = useUndoRedoSessionState();

  return {
    session,
    current: sessionState,
    set: setSessionState,
    undo: undoSessionState,
    redo: redoSessionState,
    history,
    staging,
    future,
  };
};

export const RaceTrackSimPage = () => {
  const params = useLoaderData() as { uuid: string };
  const { width, height } = useWindowDimensions();

  const sessionId = params.uuid;

  const preferences = useAtomValue(preferencesAtom);

  const [uiState, setUIState] = useImmerAtom(uiStateAtom);
  const [matrices, setMatrices] = useAtom(matricesAtom);

  const {
    sessionState,
    setSessionState,
    undoSessionState,
    redoSessionState,
    history,
    future,
    staging,
  } = useUndoRedoSessionState();

  const spherical: boolean = sessionState.country.units == 'kilometers';

  const autoGraphLayoutEngine: SpringGraphLayout = new SpringGraphLayout();

  const updateAndSetMatrices = (locations: City[], edges: Edge[]) => {
    updateMatrices(
      sessionId,
      locations,
      edges,
      sessionState.country.transportationCost,
    ).then((newMatrices) => {
      setMatrices((draft) => {
        draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
        draft.distanceMatrix = newMatrices.distanceMatrix;
        draft.predecessorMatrix = newMatrices.predecessorMatrix;
        draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
        return draft;
      });
    });
  };

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
            spherical,
          );
        });
        return draft;
      },
      graphLayoutTickResult.maximumVelocity < 1.0,
      'autoLayout',
    );

    return graphLayoutTickResult;
  }, [
    setSessionState,
    sessionState,
    sessionState.locations,
    sessionState.edges,
    uiState.selectedIndices,
    uiState.draggingIndex,
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

  const simulation = useIntervalExpScale<boolean>({
    onStarted: () => {
      requestAnimationFrame(() => {
        setSessionState(
          (draft) => {
            startSimulation(draft);
          },
          false,
          'simulationStart',
        );
      });
    },
    onReset: () => {
      requestAnimationFrame(() => {
        console.log('reset');
        setSessionState((draft) => {}, true, 'simulationReset0');
        setSessionState(
          (draft) => {
            draft.locations.forEach((location) =>
              resetCity(location, draft.locations.length),
            );
          },
          true,
          'simulationReset1',
        );
      });
    },
    tick: () => {
      requestAnimationFrame(() => {
        setSessionState(
          (draft) => {
            tickSimulator(draft, matrices.transportationCostMatrix!);
          },
          false,
          'simulationTick',
        );
      });
      return true;
    },
    isFinished: (result: boolean): boolean => {
      return false;
    },
    onFinished: (result: boolean) => {
      requestAnimationFrame(() => {
        setSessionState((draft) => {}, true, 'simulationFinished');
      });
    },
    minInterval: 10,
    maxInterval: 3000,
    initialIntervalScale: 0.5,
  });

  const undo = useCallback(() => {
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.focusedIndices = [];
        draft.selectedIndices = [];
      });
      undoSessionState();
    });
  }, [undoSessionState, setUIState]);
  const redo = useCallback(() => {
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.focusedIndices = [];
        draft.selectedIndices = [];
      });
      redoSessionState();
    });
  }, [redoSessionState, setUIState]);

  useHotkeys(['Meta+z', 'Control+z'], () => {
    if (history.length == 0) {
      openSnackBar('No more undo!');
      return;
    }
    undo();
  });
  useHotkeys(['Shift+Meta+z', 'Shift+Control+z'], () => {
    if (future.length == 0) {
      openSnackBar('No more redo!');
      return;
    }
    redo();
  });

  useHotkeys(['h'], () => {
    console.log({
      numLocations: sessionState.locations.length,
      locations: sessionState.locations,
      selectedIndices: uiState.selectedIndices,
    });
    console.log({ history, staging, future });
    //console.log({ uiState });
  });
  useHotkeys(['e'], () => {
    console.log(JSON.stringify(sessionState.edges, null, ' '));
  });

  const diagonalMatrixSetPanelRef = useRef<DiagonalMatrixSetPanelHandle>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

  const setNumLocations = useCallback(
    (numLocations: number, commit: boolean) => {
      if (numLocations < sessionState.locations.length) {
        onRemoveBulkLocations(numLocations, commit);
      } else if (sessionState.locations.length < numLocations) {
        onAddBulkLocations(numLocations, commit);
      } else {
      }
    },
    [],
  );

  const onDragStart = useCallback(
    (x: number, y: number, index: number) => {
      setDragStartPosition({ x, y });
      setUIState((draft) => {
        draft.draggingIndex = index;
      });
    },
    [setDragStartPosition, setUIState],
  );

  const onDragEnd = useCallback(
    (x: number, y: number, index: number) => {
      if (
        dragStartPosition == null ||
        (Math.abs(dragStartPosition.x - x) <= 1.0 &&
          Math.abs(dragStartPosition.y - y) <= 1.0)
      ) {
        return;
      }
      requestAnimationFrame(() => {
        setUIState((draft) => {
          draft.draggingIndex = null;
          draft.focusedIndices = [];
        });
        setDragStartPosition(null);
        setSessionState((draft) => {}, true, 'dragEnd');
        updateAndSetMatrices(sessionState.locations, sessionState.edges);
      });
    },
    [
      sessionState,
      setSessionState,
      setUIState,
      setMatrices,
      setDragStartPosition,
      updateAndSetMatrices,
    ],
  );

  const onDrag = useCallback(
    (diffX: number, diffY: number, index: number) => {
      const isDragged = diffX != 0 || diffY != 0;
      if (isDragged && dragStartPosition != null) {
        requestAnimationFrame(() => {
          const targetIndices = uiState.selectedIndices.includes(index)
            ? uiState.selectedIndices
            : [...uiState.selectedIndices, index];
          //console.log('drag', targetIndices);
          setSessionState(
            (draft) => {
              targetIndices.forEach((targetIndex) => {
                const targetId = draft.locations[targetIndex].id;
                const targetCity = draft.locations[targetIndex];

                targetCity.point[0] += diffX; // modify
                targetCity.point[1] += diffY; // modify

                if (matrices.adjacencyMatrix) {
                  draft.edges
                    .filter(
                      (edge) =>
                        edge.source === targetId || edge.target === targetId,
                    )
                    .forEach((edge) => {
                      const sourceId =
                        edge.source === targetId ? edge.target : edge.source;
                      const sourceIndex = convertIdToIndex(
                        sessionState.locations,
                        sourceId,
                      );
                      edge.distance = calculateDistanceByLocations(
                        targetCity.point,
                        sessionState.locations[sourceIndex].point,
                        spherical,
                      );
                    });
                }
              });
            },
            false,
            'drag',
          );
        });
      }
    },
    [
      uiState.selectedIndices,
      matrices.adjacencyMatrix,
      sessionState,
      dragStartPosition,
    ],
  );

  const onFocus = useCallback((focusIndices: number[]) => {
    const newFocusedIndices = focusIndices.filter((value) => value != -1);
    diagonalMatrixSetPanelRef.current?.onFocus(
      focusIndices.map((index) => index + 1),
    );
    setUIState((draft) => {
      draft.focusedIndices = newFocusedIndices;
    });
  }, []);

  const onUnfocus = useCallback((unfocusIndices: number[]) => {
    diagonalMatrixSetPanelRef.current?.onUnfocus(
      uiState.focusedIndices.map((unfocusIndices) => unfocusIndices + 1),
    );
    diagonalMatrixSetPanelRef.current?.onFocus(
      unfocusIndices.map((unfocusIndex) => unfocusIndex + 1),
    );
    setUIState((draft) => {
      draft.focusedIndices = [];
    });
  }, []);

  const onSelect = useCallback(
    (prevSelectedIndices: number[], selectedIndices: number[]) => {
      setUIState((draft) => {
        const newSelectedIndices = arrayXOR(
          prevSelectedIndices,
          selectedIndices,
        ).sort();
        diagonalMatrixSetPanelRef.current?.onSelect(
          prevSelectedIndices,
          newSelectedIndices,
        );
        draft.selectedIndices = newSelectedIndices;
        draft.draggingIndex = null;
      });
      // uiState.selectedIndices = newSelectedIndices;
    },
    [diagonalMatrixSetPanelRef.current, setUIState],
  );

  const onUnselect = useCallback(
    (prevSelectedIndices: number[], unselectedIndices: number[]) => {
      setUIState((draft) => {
        const newSelectedIndices = prevSelectedIndices.filter(
          (unselectedIndex) => !unselectedIndices.includes(unselectedIndex),
        );
        diagonalMatrixSetPanelRef.current?.onUnselect(unselectedIndices);
        draft.selectedIndices = newSelectedIndices;
        draft.draggingIndex = null;
      });
    },
    [diagonalMatrixSetPanelRef.current, setUIState],
  );

  const onPointerUp = useCallback(
    (x: number, y: number, index: number) => {
      if (
        index >= 0 &&
        (dragStartPosition == null ||
          (dragStartPosition.x == x && dragStartPosition.y == y))
      ) {
        if (uiState.selectedIndices.includes(index)) {
          onUnselect(uiState.selectedIndices, [index]);
        } else {
          onSelect(uiState.selectedIndices, [index]);
        }
      }
    },
    [dragStartPosition, onSelect, onUnselect, uiState.selectedIndices],
  );

  const onClearSelection = useCallback(() => {
    onUnselect(uiState.selectedIndices, uiState.selectedIndices);
  }, [uiState.selectedIndices]);

  const [XYZ, setXYZ] = useState<{ x: number; y: number; z: number }>({
    x: -122.45,
    y: 37.78,
    z: 10,
  });
  const onMoved = useCallback(
    (centerX: number, centerY: number, zoom: number) => {
      const xyz = globalPixelToTileXYZ({ x: centerX, y: centerY }, zoom);
      setXYZ(xyz);
    },
    [],
  );
  /*

*/
  /*
console.log("onMoved->", centerX, centerY, zoom);
const viewportCenter = {
  centerX,
  centerY,
  scale: zoom
};
setUIState((draft) => {
  if (!draft.viewportCenter) {
    draft.viewportCenter = viewportCenter;
  } else {
    draft.viewportCenter.centerX = centerX;
    draft.viewportCenter.centerY = centerY;
    draft.viewportCenter.scale = zoom;
  }
});
 */

  const doCreateViewportCenter = (uiState: UIState, locations: City[]) => {
    if (locations.length > 1) {
      const boundingRect = calcBoundingRect(locations);
      // console.log(boundingRect, uiState.splitPanelSizes[0]);
      return createViewportCenter({
        left: boundingRect.left,
        top: boundingRect.top,
        right: boundingRect.right,
        bottom: boundingRect.bottom,
        width,
        height,
        paddingMarginRatio:
          uiState.viewportCenter && uiState.viewportCenter!.scale < 1.7
            ? PADDING_MARGIN_RATIO
            : 0.5,
      });
    }
    return uiState.viewportCenter;
  };

  const onFit = useCallback(() => {
    const locations = sessionState.locations;
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.viewportCenter = doCreateViewportCenter(draft, locations);
      });
    });
  }, [sessionState.locations, setUIState]);

  const onRemoveBulkLocations = useCallback(
    (numLocations: number, commit?: boolean) => {
      requestAnimationFrame(() => {
        const { locations, edges, locationSerialNumber } = removeSubGraph(
          numLocations,
          sessionState,
        );
        setSessionState(
          (draft) => {
            draft.locations = locations;
            draft.edges = edges;
            draft.country.numLocations = numLocations;
            draft.locationSerialNumber = locationSerialNumber;
          },
          commit,
          'removeBulkLocations',
        );
        updateAndSetMatrices(locations, edges);
        setUIState((draft) => {
          draft.selectedIndices = [];
        });
      });
    },
    [
      uiState,
      sessionState.locations,
      sessionState.edges,
      sessionState.country.transportationCost,
      setMatrices,
      setUIState,
    ],
  );

  const onAddLocation = useCallback(() => {
    doAddLocation(sessionId, sessionState, uiState);
  }, [
    uiState.selectedIndices,
    sessionState.locations,
    sessionState.edges,
    sessionState.locationSerialNumber,
  ]);

  const doAddLocation = useCallback(
    (sessionId: string, sessionState: SessionState, uiState: UIState) => {
      requestAnimationFrame(() => {
        const { locations, edges, locationSerialNumber, addedIndices } =
          updateRandomSubGraph(
            sessionId,
            sessionState,
            uiState.selectedIndices,
          );

        setSessionState(
          (draft) => {
            draft.locations = locations;
            draft.edges = edges;
            draft.country.numLocations = draft.country.numLocations + 1;
            draft.locationSerialNumber = locationSerialNumber;
          },
          true,
          'addLocation',
        );
        updateAndSetMatrices(locations, edges);
        setUIState((draft) => {
          draft.focusedIndices = [...uiState.selectedIndices];
          draft.selectedIndices = [...addedIndices];
        });
      });
    },
    [updateAndSetMatrices, setUIState],
  );

  const onAddBulkLocations = useCallback(
    (numLocations: number, commit?: boolean) => {
      requestAnimationFrame(() => {
        setSessionState(
          (draft) => {
            const { locations, edges, locationSerialNumber, addedIndices } =
              updateAddedSubGraph(
                sessionId,
                sessionState,
                uiState.selectedIndices,
                numLocations,
              );
            draft.locations = locations;
            draft.edges = edges;
            draft.country.numLocations = numLocations;
            draft.locationSerialNumber = locationSerialNumber;
            updateAndSetMatrices(locations, edges);
            setUIState((draft) => {
              draft.selectedIndices = [];
              draft.focusedIndices = addedIndices;
            });
          },
          commit,
          'addBulkLocations',
        );
      });
    },
    [
      uiState.selectedIndices,
      sessionState,
      sessionState.locations,
      sessionState.edges,
      setMatrices,
      setUIState,
      setSessionState,
    ],
  );

  const updateRemovedEdges = useCallback(
    (
      selectedIndices: number[],
      edges: Edge[],
      predecessorMatrix: number[][] | null,
    ) => {
      if (!predecessorMatrix) {
        return [];
      }

      const selectedIdSet = new Set<number>(
        selectedIndices.map(
          (selectedIndex) => sessionState.locations[selectedIndex]?.id,
        ),
      );

      return edges.filter(
        (edge) =>
          !selectedIdSet.has(edge.source) && !selectedIdSet.has(edge.target),
      );
    },
    [sessionState.locations],
  );

  const updateRemovedPath = useCallback(
    (
      sourceIndex: number,
      targetIndex: number,
      edges: Edge[],
      predecessorMatrix: number[][] | null,
    ) => {
      if (!predecessorMatrix) {
        return [];
      }
      const removingEdgeSet = new Set<string>();

      function getKey(sourceId: number, nextId: number) {
        return sourceId < nextId
          ? `${sourceId},${nextId}`
          : `${nextId},${sourceId}`;
      }

      for (
        let i = 0;
        sourceIndex != targetIndex && i < predecessorMatrix.length;
        i++
      ) {
        const nextIndex = predecessorMatrix[sourceIndex][targetIndex];
        if (nextIndex == -1) break;
        removingEdgeSet.add(
          getKey(
            sessionState.locations[sourceIndex].id,
            sessionState.locations[nextIndex].id,
          ),
        );
        sourceIndex = nextIndex;
      }

      return edges.filter(
        (edge, index) => !removingEdgeSet.has(getKey(edge.source, edge.target)),
      );
    },
    [sessionState],
  );

  const onAddEdge = useCallback(() => {
    requestAnimationFrame(() => {
      setSessionState(
        (draft) => {
          const newEdges = [] as Edge[];
          for (let i = 0; i < uiState.selectedIndices.length; i++) {
            for (let j = i + 1; j < uiState.selectedIndices.length; j++) {
              const sourceIndex = uiState.selectedIndices[i];
              const source = sessionState.locations[sourceIndex];
              const targetIndex = uiState.selectedIndices[j];
              const target = sessionState.locations[targetIndex];
              if (
                isInfinity(matrices.adjacencyMatrix![sourceIndex][targetIndex])
              ) {
                const distance = calculateDistanceByLocations(
                  source.point,
                  target.point,
                  spherical,
                );
                const edge = {
                  source: source.id,
                  target: target.id,
                  distance,
                };
                newEdges.push(edge);
              }
            }
          }
          draft.edges = [...draft.edges, ...newEdges];
          updateAndSetMatrices(sessionState.locations, sessionState.edges);
        },
        true,
        'addEdge',
      );

      /*
      setUIState((draft) => {
        draft.selectedIndices = [];
      });
       */
    });
  }, [
    uiState.selectedIndices,
    sessionState.locations,
    sessionState.edges,
    sessionState.country.transportationCost,
    setSessionState,
    matrices.adjacencyMatrix,
    setMatrices,
    setUIState,
  ]);

  const onRemoveEdge = useCallback(() => {
    if (uiState.selectedIndices.length == 2) {
      const newEdges = updateRemovedPath(
        uiState.selectedIndices[0],
        uiState.selectedIndices[1],
        sessionState.edges,
        matrices.predecessorMatrix,
      );
      setSessionState(
        (draft) => {
          draft.edges = newEdges;
        },
        true,
        'removePath',
      );
    } else {
      const newEdges = updateRemovedEdges(
        uiState.selectedIndices,
        sessionState.edges,
        matrices.predecessorMatrix,
      );
      setSessionState(
        (draft) => {
          draft.edges = newEdges || [];
        },
        true,
        'removeEdge',
      );
    }
  }, [uiState.selectedIndices, sessionState.edges, matrices.predecessorMatrix]);

  const onRemoveLocation = useCallback(() => {
    requestAnimationFrame(() => {
      const newEdges =
        updateRemovedEdges(
          uiState.selectedIndices,
          sessionState.edges,
          matrices.predecessorMatrix,
        ) || [];

      const ratio =
        (sessionState.locations.length + uiState.selectedIndices.length) /
        sessionState.locations.length;

      const newLocations = sessionState.locations
        .filter((city, index) => !uiState.selectedIndices.includes(index))
        .map((city) => ({
          ...city,
          manufactureShare: city.manufactureShare * ratio,
          agricultureShare: city.agricultureShare * ratio,
        }));

      setSessionState(
        (draft) => {
          draft.locations = newLocations;
          draft.edges = newEdges;
          draft.country.numLocations = newLocations.length;
        },
        true,
        'removeLocation',
      );
      updateAndSetMatrices(newLocations, newEdges);
      setUIState((draft) => {
        draft.selectedIndices = [];
      });
    });
  }, [
    uiState.selectedIndices,
    sessionState.locations,
    sessionState.edges,
    matrices.predecessorMatrix,
    setSessionState,
  ]);

  const updateMatrices = (
    sessionId: string,
    locations: City[],
    edges: Edge[],
    transportationCost: number,
  ): Promise<AppMatrices> => {
    const matrixEngine = getMatrixEngine(
      sessionId,
      locations.length,
      edges.length,
    );

    return matrixEngine.updateAdjacencyMatrix(
      locations,
      edges,
      transportationCost,
    );
  };

  const setSessionChartType = useCallback(
    (chartType: string) => {
      setUIState((draft) => {
        draft.chartType = chartType;
      });
    },
    [setUIState],
  );

  const setSessionChartScale = useCallback(
    (chartScale: number) => {
      setUIState((draft) => {
        draft.chartScale = chartScale;
      });
    },
    [setUIState],
  );

  const setSessionViewportCenter = useCallback(
    (viewportCenter: ViewportCenter) => {
      setUIState((draft) => {
        draft.viewportCenter = viewportCenter;
      });
    },
    [setUIState],
  );

  useEffect(() => {
    updateAndSetMatrices(sessionState.locations, sessionState.edges);
  }, [
    sessionState.locations,
    sessionState.edges,
    sessionState.country.transportationCost,
    setMatrices,
  ]);

  const setManufactureShare = useCallback(
    (manufactureShare: number, commit?: boolean) => {
      setSessionState(
        (draft) => {
          draft.country.manufactureShare = manufactureShare;
        },
        commit,
        'updateCountry',
      );
    },
    [
      sessionState.locations,
      sessionState.edges,
      sessionState.country,
      setSessionState,
    ],
  );
  const setTransportationCost = useCallback(
    (transportationCost: number, commit?: boolean) => {
      setSessionState(
        (draft) => {
          draft.country.transportationCost = transportationCost;
        },
        commit,
        'updateCountry',
      );
    },
    [
      sessionState.locations,
      sessionState.edges,
      sessionState.country,
      setSessionState,
    ],
  );
  const setElasticitySubstitution = useCallback(
    (elasticitySubstitution: number, commit?: boolean) => {
      setSessionState(
        (draft) => {
          draft.country.elasticitySubstitution = elasticitySubstitution;
        },
        commit,
        'updateCountry',
      );
    },
    [
      sessionState.locations,
      sessionState.edges,
      sessionState.country,
      setSessionState,
    ],
  );

  useEffect(() => {
    setGraphPanelButtonState({
      addLocation: !simulation.isStarted,
      removeLocation:
        !simulation.isStarted && uiState.selectedIndices.length > 0,
      addEdge: !simulation.isStarted && uiState.selectedIndices.length >= 2,
      removeEdge: !simulation.isStarted && uiState.selectedIndices.length >= 2,
      autoGraphLayout:
        sessionState.country.units == 'kilometers' &&
        !autoGraphLayoutTimer.isStarted,
      undo: history.length > 0,
      redo: future.length > 0,
    });
  }, [
    autoGraphLayoutTimer.isStarted,
    simulation.isStarted,
    uiState.selectedIndices,
    history.length,
    future.length,
  ]);

  const [snackBarState, setSnackBarState] = useState<{
    open: boolean;
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    message: string;
  }>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  });

  const openSnackBar = useCallback(
    (message: string) => {
      setSnackBarState({ ...snackBarState, open: true, message });
    },
    [snackBarState, setSnackBarState],
  );

  const closeSnackBar = useCallback(() => {
    setSnackBarState({ ...snackBarState, open: false });
  }, [snackBarState, setSnackBarState]);

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
    [autoGraphLayoutTimer.isStarted, autoGraphLayoutTimer.intervalScale],
  );

  useEffect(() => {
    document.title = `GEO-ECO: ${sessionState.country.title} - Geological Economics Modeling Simulator`;
  }, [sessionState.country.title]);

  useLayoutEffect(() => {
    if (uiState.viewportCenter == null) {
      onFit();
    }
  }, []);

  return (
    <DesktopComponent
      gridItems={[
        {
          layout: {
            i: 'Background',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            resizeHandles: [],
            static: true,
          },
          resource: {
            id: 'Background',
            type: GridItemType.Background,
            children: (
              <div
                style={{
                  width: width + 'px',
                  height: height + 'px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ddf',
                }}
              >
                <EuclideanCanvas
                  width={width}
                  height={height}
                  boundingBox={{
                    ...calcBoundingRect(sessionState.locations),
                    paddingMarginRatio: PADDING_MARGIN_RATIO,
                  }}
                  setViewportCenter={setSessionViewportCenter}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDrag={onDrag}
                  onFocus={onFocus}
                  onUnfocus={onUnfocus}
                  onPointerUp={onPointerUp}
                  onClearSelection={onClearSelection}
                  onMoved={onMoved}
                  draggingIndex={uiState.draggingIndex}
                  sessionState={sessionState}
                  viewportCenter={uiState.viewportCenter}
                  selectedIndices={uiState.selectedIndices}
                  focusedIndices={uiState.focusedIndices}
                  matrices={matrices}
                />
              </div>
            ),
            shown: true,
            enabled: true,
          },
        },
        {
          layout: {
            i: 'HomeButton',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            resizeHandles: [],
            isDraggable: true,
            isResizable: false,
          },
          resource: {
            id: 'HomeButton',
            type: GridItemType.FloatingButton,
            tooltip: 'Home',
            icon: <Home />,
            navigateTo: '/',
            shown: true,
            enabled: true,
          },
        },
        {
          layout: {
            i: 'InputOutputButton',
            x: 0,
            y: 1,
            w: 1,
            h: 1,
            resizeHandles: [],
            isDraggable: true,
            isResizable: false,
          },
          resource: {
            id: 'InputOutputButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'InputOutput',
            tooltip: 'Open Input/Output Panel',
            icon: <FolderOpen />,
            shown: true,
            enabled: false,
          },
        },
        {
          layout: {
            i: 'InputOutput',
            x: 1,
            y: 0,
            w: 7,
            h: 3,
            resizeHandles: ['se'],
            isDraggable: true,
            isResizable: true,
          },
          resource: {
            id: 'InputOutput',
            type: GridItemType.FloatingPanel,
            title: 'Input/Output Panel',
            icon: <FolderOpen />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: true,
            children: (
              <Box style={{ display: 'flex', gap: '10px' }}>
                <Button variant={'contained'}>Import...</Button>
                <Button variant={'contained'}>Export...</Button>
              </Box>
            ),
            bindToButtonId: 'InputOutputButton',
          },
        },
        {
          layout: {
            i: 'EditButton',
            x: 0,
            y: 2,
            w: 1,
            h: 1,
            resizeHandles: [],
            isDraggable: true,
            isResizable: false,
          },
          resource: {
            id: 'EditButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'Edit',
            tooltip: 'Open Edit Panel',
            icon: <Edit />,
            shown: true,
            enabled: false,
          },
        },
        {
          layout: {
            i: 'Edit',
            x: 2,
            y: 1,
            w: 7,
            h: 3,
            resizeHandles: ['se'],
            isDraggable: true,
            isResizable: true,
          },
          resource: {
            id: 'Edit',
            type: GridItemType.FloatingPanel,
            title: 'Editor Panel',
            icon: <Edit />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: false,
            children: (
              <Box style={{ display: 'flex', gap: '10px' }}>
                <Button variant={'contained'}>AddNode</Button>
                <Button variant={'contained'}>RemoveNode</Button>
                <Button variant={'contained'}>AddRoute</Button>
                <Button variant={'contained'}>RemoveRoute</Button>
              </Box>
            ),
            bindToButtonId: 'EditButton',
          },
        },
        {
          layout: {
            i: 'CountryConfigButton',
            x: 0,
            y: 3,
            w: 1,
            h: 1,
            isDraggable: true,
            isResizable: false,
            resizeHandles: [],
          },
          resource: {
            id: 'CountryConfigButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'CountryConfig',
            tooltip: 'Open CountryConfig Panel',
            icon: <Flag />,
            shown: true,
            enabled: false,
          },
        },
        {
          layout: {
            i: 'CountryConfig',
            x: 1,
            y: 3,
            w: 9,
            h: 8,
            isDraggable: true,
            isResizable: true,
            resizeHandles: ['se'],
          },
          resource: {
            id: 'CountryConfig',
            type: GridItemType.FloatingPanel,
            title: 'CountryConfig Panel',
            icon: <Flag />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: true,
            bindToButtonId: 'CountryConfigButton',
            children: (
              <CountryConfigPanel
                country={sessionState.country}
                setNumLocations={setNumLocations}
                setManufactureShare={setManufactureShare}
                setTransportationCost={setTransportationCost}
                setElasticitySubstitution={setElasticitySubstitution}
              />
            ),
          },
        },
        {
          layout: {
            i: 'MatricesButton',
            x: 0,
            y: 4,
            w: 1,
            h: 1,
            isDraggable: true,
            isResizable: false,
            resizeHandles: [],
          },
          resource: {
            id: 'MatricesButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'Matrices',
            tooltip: 'Open Matrices Panel',
            icon: <GridOn />,
            shown: true,
            enabled: false,
          },
        },
        {
          layout: {
            i: 'Matrices',
            x: 1,
            y: 11,
            w: 23,
            h: 11,
            isDraggable: true,
            isResizable: true,
            resizeHandles: ['se'],
          },
          resource: {
            id: 'Matrices',
            type: GridItemType.FloatingPanel,
            title: 'Matrices Panel',
            icon: <GridOn />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: true,
            bindToButtonId: 'MatricesButton',
            children: (
              <MatrixSetPanel
                ref={diagonalMatrixSetPanelRef}
                locations={sessionState.locations}
                maxRowColLength={preferences.maxRowColLength}
                adjacencyMatrix={matrices.adjacencyMatrix}
                distanceMatrix={matrices.distanceMatrix}
                transportationCostMatrix={matrices.transportationCostMatrix}
                rgb={{ r: 23, g: 111, b: 203 }}
                selectedIndices={uiState.selectedIndices}
                focusedIndices={uiState.focusedIndices}
                onSelected={onSelect}
                onFocus={onFocus}
                onUnfocus={onUnfocus}
              />
            ),
          },
        },

        {
          layout: {
            i: 'TimerControlButton',
            x: 0,
            y: 5,
            w: 1,
            h: 1,
            isDraggable: true,
            isResizable: false,
            resizeHandles: [],
          },
          resource: {
            id: 'TimerControlButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'TimerControl',
            tooltip: 'Open TimerControl Panel',
            icon: <Timer />,
            shown: true,
            enabled: false,
          },
        },
        {
          layout: {
            i: 'TimerControl',
            x: 1,
            y: 22,
            w: 22,
            h: 3,
            isDraggable: true,
            isResizable: true,
            resizeHandles: ['se'],
          },
          resource: {
            id: 'TimerControl',
            type: GridItemType.FloatingPanel,
            title: 'TimerControl Panel',
            icon: <Timer />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: true,
            bindToButtonId: 'TimerControlButton',
            children: (
              <TimeControlPanel
                counter={simulation.counter}
                isStarted={simulation.isStarted}
                onStart={simulation.start}
                onStop={simulation.stop}
                onReset={simulation.reset}
                intervalScale={simulation.intervalScale}
                changeIntervalScale={simulation.changeIntervalScale}
              />
            ),
          },
        },

        {
          layout: {
            i: 'ChartButton',
            x: 0,
            y: 6,
            w: 1,
            h: 1,
            isDraggable: true,
            isResizable: false,
            resizeHandles: [],
          },
          resource: {
            id: 'ChartButton',
            type: GridItemType.FloatingButton,
            bindToPanelId: 'Chart',
            tooltip: 'Open Chart Panel',
            icon: <BarChart />,
            shown: true,
            enabled: false,
          },
        },
        {
          layout: {
            i: 'Chart',
            x: 22,
            y: 0,
            w: 10,
            h: 10,
            isDraggable: true,
            isResizable: true,
            resizeHandles: ['se'],
          },
          resource: {
            id: 'Chart',
            type: GridItemType.FloatingPanel,
            title: 'Chart Panel',
            icon: <BarChart />,
            titleBarMode: 'win',
            rowHeight: ROW_HEIGHT,
            shown: true,
            bindToButtonId: 'ChartButton',
            children: (
              <ChartPanel
                onChangeChartType={setSessionChartType}
                onChangeScale={setSessionChartScale}
                scale={uiState.chartScale}
                chartType={uiState.chartType}
              >
                <ChartCanvas
                  width={300}
                  height={300}
                  chartTypeKey={uiState.chartType}
                  scale={uiState.chartScale}
                  locations={sessionState.locations}
                  focusedIndices={uiState.focusedIndices}
                  selectedIndices={uiState.selectedIndices}
                  onFocus={onFocus}
                  onUnfocus={onUnfocus}
                  onSelect={onSelect}
                  onUnselect={onUnselect}
                />
              </ChartPanel>
            ),
          },
        },
      ]}
    />
  );
};
