import 'split-pane-react/esm/themes/default.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { preferencesAtom } from '../../atoms/atoms';
import { useAtomValue } from 'jotai';
import { useSessionStateUndoRedo } from './UseSessionStateUndoRedo';
import useHotkeys from '@reecelucas/react-use-hotkeys';
import {
  DiagonalMatrixSetPanelHandle,
  MatrixSetPanel,
} from './MatrixSetPanel/MatrixSetPanel';
import { SpringGraphLayout } from '../../graphLayout/SpringGraphLayout';
import { GraphPanelButtonsState } from './GraphPanel/GraphPanelButtonsState';
import { arrayXOR, convertIdToIndex } from '../../util/arrayUtil';
import { calculateDistanceByLocations } from '../../core/calculateDistanceByLocations';
import { City } from '../../model/City';
import { calcBoundingRect } from './GraphPanel/calcBoundingRect';
import { createViewportWindow } from './GraphPanel/CreateViewportWindow';
import { PADDING_MARGIN_RATIO } from './GraphPanel/Constatns';
import { addSubGraph, removeSubGraph } from '../../model/GraphHandlers';
import { Edge } from '../../model/Graph';
import { isInfinity } from '../../util/mathUtil';
import { getMatrixEngine } from '../../core/MatrixEngineService';
import {
  AppTimer,
  isTimerStarted,
  resetTimer,
  startTimer,
  stopTimer,
  updateSpeed,
} from '../../model/AppTimer';
import { ViewportWindow } from '../../model/ViewportWindow';
import { Box, LinearProgress, Typography } from '@mui/material';
import { SessionLayoutPanel } from './SessionLayoutPanel';
import AppAccordion from '../../../components/AppAccordion/AppAccordion';
import { GridOn, LinearScale } from '@mui/icons-material';
import { SessionSelectorAccordionSummaryTitle } from './SessionSelectorAccordionSummaryTitle';
import CountryConfigPanel from './CountryConfigPanel/CountryConfigPanel';
import { MatrixSetAccordionSummaryTitle } from './MatrixSetPanel/MatrixSetAccordionSummaryTitle';
import TimeControlPanel from './TimeControPanel/TimeControlPanel';
import GraphPanel from './GraphPanel/GraphPanel';
import { GraphCanvas } from './GraphPanel/GraphCanvas';
import { ChartCanvas } from './ChartPanel/ChartCanvas';
import { ChartPanel } from './ChartPanel/ChartPanel';
import { UIState } from '../../model/UIState';

type SessionPanelProps = {
  sessionId: string;
};

export const SessionPanel = React.memo((props: SessionPanelProps) => {
  // const rand = new SeedRandom(new Date());
  const sessionId: string = props.sessionId;
  const preferences = useAtomValue(preferencesAtom);

  const {
    uiState,
    setUIState,
    matrices,
    setMatrices,
    sessionState,
    setSessionState,
    undoSessionState,
    redoSessionState,
    history,
    future,
    timers,
    setTimers,
  } = useSessionStateUndoRedo(sessionId);

  const undo = useCallback(() => {
    requestAnimationFrame(() => undoSessionState());
  }, [undoSessionState]);
  const redo = useCallback(() => {
    requestAnimationFrame(() => redoSessionState());
  }, [redoSessionState]);

  useHotkeys(['Meta+z', 'Control+z'], () => {
    undo();
  });
  useHotkeys(['Shift+Meta+z', 'Shift+Control+z'], () => {
    redo();
  });

  const diagonalMatrixSetPanelRef = useRef<DiagonalMatrixSetPanelHandle>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const autoGraphLayout: SpringGraphLayout = new SpringGraphLayout();
  const [graphPanelButtonState, setGraphPanelButtonState] =
    useState<GraphPanelButtonsState>({
      addLocation: false,
      removeLocation: false,
      addEdge: false,
      removeEdge: false,
      autoGraphLayout: true,
      mapLayer: true,
      undo: false,
      redo: false,
    });

  const onUpdateNumLocations = useCallback(
    async (numLocations: number, commit?: boolean) => {
      if (numLocations < sessionState.locations.length) {
        onRemoveBulkLocations(numLocations, commit);
      } else if (sessionState.locations.length < numLocations) {
        onAddBulkLocations(numLocations, commit);
      }
    },
    []
  );

  const onDragStart = useCallback(
    (x: number, y: number, index: number) => {
      setDragStartPosition({ x, y });
      setUIState((draft) => {
        draft.draggingIndex = index;
      });
    },
    [setDragStartPosition, setUIState]
  );

  const onDragEnd = useCallback(
    async (x: number, y: number, index: number) => {
      setUIState((draft) => {
        draft.draggingIndex = null;
        draft.focusedIndices = [];
      });
      if (
        dragStartPosition == null ||
        (dragStartPosition.x == x && dragStartPosition.y == y)
      ) {
        return;
      }
      setDragStartPosition(null);
      requestAnimationFrame(async () => {
        setSessionState((draft) => {
          draft.locations = sessionState.locations;
          draft.edges = sessionState.edges;
        });
        const newMatrices = await updateMatrices(
          sessionId,
          sessionState.locations,
          sessionState.edges,
          sessionState.country.transportationCost
        );
        setMatrices((draft) => {
          draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
          draft.distanceMatrix = newMatrices.distanceMatrix;
          draft.predecessorMatrix = newMatrices.predecessorMatrix;
          draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
        });
      });
    },
    [sessionState, setUIState, setMatrices]
  );

  const onDrag = useCallback(
    (diffX: number, diffY: number, index: number) => {
      const isDragged = diffX != 0 || diffY != 0;
      if (isDragged && dragStartPosition != null) {
        requestAnimationFrame(() => {
          const targetIndices = uiState.selectedIndices.includes(index)
            ? uiState.selectedIndices
            : [...uiState.selectedIndices, index];
          setSessionState((draft) => {
            targetIndices.forEach((targetIndex) => {
              const targetId = draft.locations[targetIndex].id;
              const targetCity = draft.locations[targetIndex];

              targetCity.x += diffX; // modify
              targetCity.y += diffY; // modify

              if (matrices.adjacencyMatrix) {
                draft.edges
                  .filter(
                    (edge) =>
                      edge.source === targetId || edge.target === targetId
                  )
                  .forEach((edge) => {
                    const sourceId =
                      edge.source === targetId ? edge.target : edge.source;
                    const sourceIndex = convertIdToIndex(
                      sessionState.locations,
                      sourceId
                    );
                    edge.distance = calculateDistanceByLocations(
                      targetCity,
                      sessionState.locations[sourceIndex]
                    );
                  });
              }
            });
          }, false);
        });
      }
    },
    [
      uiState.selectedIndices,
      matrices.adjacencyMatrix,
      sessionState,
      dragStartPosition,
    ]
  );

  const onFocus = useCallback((focusIndices: number[]) => {
    const newFocusedIndices = focusIndices.filter((value) => value != -1);
    diagonalMatrixSetPanelRef.current?.onFocus(
      focusIndices.map((index) => index + 1)
    );
    setUIState((draft) => {
      draft.focusedIndices = newFocusedIndices;
    });
  }, []);

  const onUnfocus = useCallback((unfocusIndices: number[]) => {
    diagonalMatrixSetPanelRef.current?.onUnfocus(
      uiState.focusedIndices.map((unfocusIndices) => unfocusIndices + 1)
    );
    diagonalMatrixSetPanelRef.current?.onFocus(
      unfocusIndices.map((unfocusIndex) => unfocusIndex + 1)
    );
    setUIState((draft) => {
      draft.focusedIndices = [];
    });
  }, []);

  const onSelect = useCallback(
    (prevSelectedIndices: number[], selectedIndices: number[]) => {
      requestAnimationFrame(() => {
        const newSelectedIndices = arrayXOR(
          prevSelectedIndices,
          selectedIndices
        ).sort();
        diagonalMatrixSetPanelRef.current?.onSelect(
          prevSelectedIndices,
          newSelectedIndices
        );
        setUIState((draft) => {
          draft.selectedIndices = newSelectedIndices;
          draft.draggingIndex = null;
        });
        // uiState.selectedIndices = newSelectedIndices;
      });
    },
    [uiState.selectedIndices, setUIState, uiState]
  );

  const onUnselect = useCallback(
    (prevSelectedIndices: number[], unselectedIndices: number[]) => {
      const newSelectedIndices = prevSelectedIndices.filter(
        (unselectedIndex) => !unselectedIndices.includes(unselectedIndex)
      );
      diagonalMatrixSetPanelRef.current?.onUnselect(unselectedIndices);
      setUIState((draft) => {
        draft.selectedIndices = newSelectedIndices;
        draft.draggingIndex = null;
      });
    },
    [uiState.selectedIndices, setUIState, uiState]
  );

  const onPointerUp = useCallback(
    (x: number, y: number, index: number) => {
      if (
        dragStartPosition == null ||
        (dragStartPosition.x == x && dragStartPosition.y == y)
      ) {
        if (uiState.selectedIndices.includes(index)) {
          onUnselect(uiState.selectedIndices, [index]);
        } else {
          onSelect(uiState.selectedIndices, [index]);
        }
      }
    },
    [dragStartPosition, onSelect, onUnselect, uiState.selectedIndices]
  );

  const onClearSelection = useCallback(() => {
    onUnselect(uiState.selectedIndices, uiState.selectedIndices);
  }, [uiState.selectedIndices]);

  const fit = useCallback((uiState: UIState, locations: City[]) => {
    if (locations.length > 1) {
      const boundingRect = calcBoundingRect(locations);
      return createViewportWindow({
        left: boundingRect.left,
        top: boundingRect.top,
        right: boundingRect.right,
        bottom: boundingRect.bottom,
        screenWidth: uiState.splitPanelSizes[0],
        screenHeight: uiState.splitPanelHeight,
        paddingMarginRatio:
          uiState.viewportWindow && uiState.viewportWindow!.scale < 1.7
            ? PADDING_MARGIN_RATIO
            : 0.5,
      });
    }
    return uiState.viewportWindow;
  }, []);

  const onFit = useCallback(() => {
    setUIState((draft) => {
      draft.viewportWindow = fit(draft, sessionState.locations);
    });
  }, [sessionState.locations, setUIState]);

  const onRemoveBulkLocations = useCallback(
    (numLocations: number, commit?: boolean) => {
      requestAnimationFrame(async () => {
        const { locations, edges, locationSerialNumber } = removeSubGraph(
          numLocations,
          sessionState
        );
        setSessionState((draft) => {
          draft.locations = locations;
          draft.edges = edges;
          draft.country.numLocations = numLocations;
          draft.locationSerialNumber = locationSerialNumber;
        }, commit);

        const newMatrices = await updateMatrices(
          sessionId,
          locations,
          edges,
          sessionState.country.transportationCost
        );
        setMatrices((draft) => {
          draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
          draft.distanceMatrix = newMatrices.distanceMatrix;
          draft.predecessorMatrix = newMatrices.predecessorMatrix;
          draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
        });

        setUIState((draft) => {
          draft.selectedIndices = [];
          // draft.viewportWindow = fit(draft, locations);
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
    ]
  );

  const onAddLocation = useCallback(async () => {
    const { locations, edges, locationSerialNumber } = addSubGraph(
      sessionState,
      uiState.selectedIndices
    );
    console.log('onAddLocation');
    setSessionState((draft) => {
      draft.locations = locations;
      draft.edges = edges;
      draft.country.numLocations = draft.country.numLocations + 1;
      draft.locationSerialNumber = locationSerialNumber;
    });

    setUIState((draft) => {
      draft.selectedIndices = [];
    });
    const newMatrices = await updateMatrices(
      sessionId,
      locations,
      edges,
      sessionState.country.transportationCost
    );
    setMatrices((draft) => {
      draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
      draft.distanceMatrix = newMatrices.distanceMatrix;
      draft.predecessorMatrix = newMatrices.predecessorMatrix;
      draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
    });
  }, [uiState.selectedIndices, sessionState]);

  const onAddBulkLocations = useCallback(
    (numLocations: number, commit?: boolean) => {
      requestAnimationFrame(async () => {
        const { locations, edges, locationSerialNumber } = addSubGraph(
          sessionState,
          uiState.selectedIndices,
          numLocations
        );
        setSessionState((draft) => {
          draft.locations = locations;
          draft.edges = edges;
          draft.country.numLocations = numLocations;
          draft.locationSerialNumber = locationSerialNumber;
        }, commit);
        const newMatrices = await updateMatrices(
          sessionId,
          locations,
          edges,
          sessionState.country.transportationCost
        );
        setMatrices((draft) => {
          draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
          draft.distanceMatrix = newMatrices.distanceMatrix;
          draft.predecessorMatrix = newMatrices.predecessorMatrix;
          draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
        });
        setUIState((draft) => {
          // draft.viewportWindow = fit(draft, locations);
          draft.selectedIndices = [];
        });
      });
    },
    [uiState.selectedIndices, sessionState, setMatrices, setUIState]
  );

  const removeEdges = useCallback(
    (
      selectedIndices: number[],
      edges: Edge[],
      predecessorMatrix: number[][] | null
    ) => {
      if (!predecessorMatrix) {
        return;
      }

      const selectedIdSet = new Set<number>(
        selectedIndices.map(
          (selectedIndex) => sessionState.locations[selectedIndex].id
        )
      );

      const newEdges = edges.filter(
        (edge) =>
          !selectedIdSet.has(edge.source) && !selectedIdSet.has(edge.target)
      );

      setSessionState((draft) => {
        draft.edges = newEdges;
      });
      return newEdges;
    },
    [sessionState]
  );

  const removePath = useCallback(
    (
      sourceIndex: number,
      targetIndex: number,
      edges: Edge[],
      predecessorMatrix: number[][] | null
    ) => {
      if (!predecessorMatrix) {
        return null;
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
            sessionState.locations[nextIndex].id
          )
        );
        sourceIndex = nextIndex;
      }

      const newEdges = edges.filter(
        (edge, index) => !removingEdgeSet.has(getKey(edge.source, edge.target))
      );

      setSessionState((draft) => {
        draft.edges = newEdges;
      });
    },
    [sessionState]
  );

  const onAddEdge = useCallback(async () => {
    const newEdges = [] as Edge[];

    if (!matrices.adjacencyMatrix) {
      return;
    }

    for (let i = 0; i < uiState.selectedIndices.length; i++) {
      for (let j = i + 1; j < uiState.selectedIndices.length; j++) {
        const sourceIndex = uiState.selectedIndices[i];
        const source = sessionState.locations[sourceIndex];
        const targetIndex = uiState.selectedIndices[j];
        const target = sessionState.locations[targetIndex];
        if (isInfinity(matrices.adjacencyMatrix![sourceIndex][targetIndex])) {
          const distance = calculateDistanceByLocations(source, target);
          const edge = {
            source: source.id,
            target: target.id,
            distance,
          };
          newEdges.push(edge);
        }
      }
    }
    console.log('onAddEdge');

    setSessionState((draft) => {
      draft.edges = sessionState.edges.concat(newEdges);
    });
    const newMatrices = await updateMatrices(
      sessionId,
      sessionState.locations,
      sessionState.edges,
      sessionState.country.transportationCost
    );
    setMatrices((draft) => {
      draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
      draft.distanceMatrix = newMatrices.distanceMatrix;
      draft.predecessorMatrix = newMatrices.predecessorMatrix;
      draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
    });

    setUIState((draft) => {
      draft.selectedIndices = [];
    });
  }, [uiState.selectedIndices, sessionState]);

  const onRemoveEdge = useCallback(() => {
    if (uiState.selectedIndices.length == 2) {
      removePath(
        uiState.selectedIndices[0],
        uiState.selectedIndices[1],
        sessionState.edges,
        matrices.predecessorMatrix
      );
    } else {
      removeEdges(
        uiState.selectedIndices,
        sessionState.edges,
        matrices.predecessorMatrix
      );
    }
  }, [uiState.selectedIndices, sessionState.edges, matrices.predecessorMatrix]);

  const onRemoveLocation = useCallback(async () => {
    const newEdges =
      removeEdges(
        uiState.selectedIndices,
        sessionState.edges,
        matrices.predecessorMatrix
      ) || [];

    const ratio =
      (sessionState.locations.length + uiState.selectedIndices.length) /
      sessionState.locations.length;

    const newLocations = sessionState.locations
      .filter((city, index) => !uiState.selectedIndices.includes(index))
      .map((city) => ({
        ...city,
        manufacturingShare: city.manufacturingShare * ratio,
        agricultureShare: city.agricultureShare * ratio,
      }));

    console.log('onRemoveLocation');
    setSessionState((draft) => {
      draft.locations = newLocations;
      draft.edges = newEdges;
      draft.country.numLocations = newLocations.length;
    });
    const newMatrices = await updateMatrices(
      sessionId,
      newLocations,
      newEdges,
      sessionState.country.transportationCost
    );
    setMatrices((draft) => {
      draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
      draft.distanceMatrix = newMatrices.distanceMatrix;
      draft.predecessorMatrix = newMatrices.predecessorMatrix;
      draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
    });

    setUIState((draft) => {
      draft.selectedIndices = [];
    });
  }, [
    uiState.selectedIndices,
    sessionState.locations,
    sessionState.edges,
    matrices.predecessorMatrix,
  ]);

  const setAutoLayoutSpeedAndStartStop = useCallback(
    async (speed: number) => {
      if (speed == 0) {
        setUIState((draft) => {
          draft.draggingIndex = null;
        });

        const newMatrices = await updateMatrices(
          sessionId,
          sessionState.locations,
          sessionState.edges,
          sessionState.country.transportationCost
        );
        setMatrices((draft) => {
          draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
          draft.distanceMatrix = newMatrices.distanceMatrix;
          draft.predecessorMatrix = newMatrices.predecessorMatrix;
          draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
        });

        setTimers((draft) => {
          draft.autoGraphLayoutTimer = stopTimer(draft.autoGraphLayoutTimer);
        });
      } else {
        setUIState((draft) => {
          draft.draggingIndex = null;
        });
        setTimers((draft) => {
          draft.autoGraphLayoutTimer = startTimer(
            draft.autoGraphLayoutTimer,
            speed,
            autoGraphLayoutTicker,
            async () => {
              const matrices = await updateMatrices(
                sessionId,
                sessionState.locations,
                sessionState.edges,
                sessionState.country.transportationCost
              );
              setTimers((draft) => {
                draft.autoGraphLayoutTimer = stopTimer(
                  draft.autoGraphLayoutTimer,
                  -1
                );
              });
              setMatrices((draft) => {
                draft.adjacencyMatrix = matrices.adjacencyMatrix;
                draft.distanceMatrix = matrices.distanceMatrix;
                draft.predecessorMatrix = matrices.predecessorMatrix;
                draft.transportationCostMatrix =
                  matrices.transportationCostMatrix;
              });
            }
          );
        });
      }
    },
    [sessionState]
  );

  function simulationTicker() {
    setSessionSimulationTimer({
      ...timers.simulationTimer,
      counter: timers.simulationTimer.counter + 1,
    });
    return false; // FIXME: return true if the simulation reaches termination condition
  }

  function autoGraphLayoutTicker() {
    const isStable = autoGraphLayout.tick(
      sessionState.locations,
      sessionState.edges,
      matrices.adjacencyMatrix,
      uiState.selectedIndices,
      uiState.draggingIndex
    );

    setAutoGraphLayoutTimer({
      ...timers.autoGraphLayoutTimer,
      counter: timers.autoGraphLayoutTimer.counter + 1,
    });

    return isStable;
  }

  async function updateMatrices(
    sessionId: string,
    locations: City[],
    edges: Edge[],
    transportationCost: number
  ) {
    const matrixEngine = getMatrixEngine(
      sessionId,
      locations.length,
      edges.length
    );

    return await matrixEngine.updateAdjacencyMatrix(
      locations,
      edges,
      transportationCost
    );
  }

  const setAutoGraphLayoutTimer = (appTimer: AppTimer) => {
    setTimers((draft) => {
      draft.autoGraphLayoutTimer = appTimer;
    });
  };

  const setSessionSimulationTimer = (appTimer: AppTimer) => {
    setTimers((draft) => {
      draft.simulationTimer = appTimer;
    });
  };

  /*
  const updateMatricesInBackground = () => {
    const currentSequence = ++latestSequence.current;
    const onIdle: IdleRequestCallback = async (deadline) => {
      if (currentSequence === latestSequence.current) {
        set(
          produce(session, (draft) => {
            updateMatrices(
              currentSequence,
              draft,
              draft.locations,
              draft.edges,
              draft.country.transportationCost
            );
          })
        );
      }
    };
    // Schedule the background update in an idle callback
    window.requestIdleCallback(onIdle, { timeout: 1000 });
  };
   */

  const setMapLayer = useCallback(
    (enableMapLayer: boolean) => {
      setUIState((draft) => {
        draft.layer.map = enableMapLayer;
      });
    },
    [setUIState]
  );

  const setSessionChartType = useCallback(
    (chartType: string) => {
      setUIState((draft) => {
        draft.chartType = chartType;
      });
    },
    [setUIState]
  );

  const setSessionChartScale = useCallback(
    (chartScale: number) => {
      setUIState((draft) => {
        draft.chartScale = chartScale;
      });
    },
    [setUIState]
  );

  const setSessionViewportWindow = useCallback(
    (viewportWindow: ViewportWindow) => {
      setUIState((draft) => {
        draft.viewportWindow = viewportWindow;
      });
    },
    [setUIState]
  );

  const setLockDiagonalMatrixSetPanelAccordion = useCallback(
    (lock: boolean) => {
      setUIState((draft) => {
        draft.lockMatrixSetPanelAccordion = lock;
      });
    },
    [setUIState]
  );

  const setCaseSelectorPanelAccordion = useCallback(
    (expanded: boolean) => {
      setUIState((draft) => {
        draft.countryConfigPanelAccordion = expanded;
      });
    },
    [setUIState]
  );

  const setDiagonalMatrixSetPanelAccordion = useCallback(
    (expanded: boolean) => {
      setUIState((draft) => {
        draft.matrixSetPanelAccordion = expanded;
      });
    },
    [setUIState]
  );

  useEffect(() => {
    (async () => {
      const newMatrices = await updateMatrices(
        sessionId,
        sessionState.locations,
        sessionState.edges,
        sessionState.country.transportationCost
      );
      setMatrices((draft) => {
        draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
        draft.distanceMatrix = newMatrices.distanceMatrix;
        draft.predecessorMatrix = newMatrices.predecessorMatrix;
        draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
      });
    })();
  }, [
    sessionState.locations,
    sessionState.edges,
    sessionState.country.transportationCost,
    setMatrices,
  ]);

  const isSimulationStarted = isTimerStarted(timers.simulationTimer);
  const isAutoGraphLayoutStarted = isTimerStarted(timers.autoGraphLayoutTimer);

  const setShareManufacturing = useCallback(
    (shareManufacturing: number, commit?: boolean) => {
      setSessionState((draft) => {
        draft.country.shareManufacturing = shareManufacturing;
      }, commit);
    },
    [
      sessionState.locations,
      sessionState.edges,
      sessionState.country,
      setSessionState,
    ]
  );
  const setTransportationCost = useCallback(
    (transportationCost: number, commit?: boolean) => {
      setSessionState((draft) => {
        draft.country.transportationCost = transportationCost;
      }, commit);
    },
    [
      sessionState.locations,
      sessionState.edges,
      sessionState.country,
      setSessionState,
    ]
  );
  const setElasticitySubstitution = useCallback(
    (elasticitySubstitution: number, commit?: boolean) => {
      setSessionState((draft) => {
        draft.country.elasticitySubstitution = elasticitySubstitution;
      }, commit);
    },
    [
      sessionState.locations,
      sessionState.edges,
      sessionState.country,
      setSessionState,
    ]
  );

  useEffect(() => {
    setGraphPanelButtonState({
      addLocation: !isSimulationStarted,
      removeLocation:
        !isSimulationStarted && uiState.selectedIndices.length > 0,
      addEdge: !isSimulationStarted && uiState.selectedIndices.length >= 2,
      removeEdge: !isSimulationStarted && uiState.selectedIndices.length >= 2,
      autoGraphLayout: !isSimulationStarted,
      mapLayer: true,
      undo: history.length > 0,
      redo: future.length > 0,
    });
  }, [
    timers.simulationTimer,
    uiState.selectedIndices,
    history.length,
    future.length,
  ]);

  useEffect(() => {
    document.title = `GEO-ECO: ${sessionState.country.title} - Geological Economics Modeling Simulator`;
  }, [sessionState.country.title]);

  return (
    <>
      {isSimulationStarted ? (
        <LinearProgress color="primary" />
      ) : isAutoGraphLayoutStarted ? (
        <LinearProgress color="warning" />
      ) : (
        <Box sx={{ height: '4px' }} />
      )}

      <SessionLayoutPanel
        uiState={uiState}
        setUIState={setUIState}
        left={
          <GraphPanel
            hideGraphEditButtons={isSimulationStarted}
            state={graphPanelButtonState}
            onFit={onFit}
            onAddLocation={onAddLocation}
            onRemoveLocation={onRemoveLocation}
            onAddEdge={onAddEdge}
            onRemoveEdge={onRemoveEdge}
            onUndo={undo}
            onRedo={redo}
            autoGraphLayoutSpeed={timers.autoGraphLayoutTimer.speed}
            setAutoGraphLayoutSpeed={setAutoLayoutSpeedAndStartStop}
            mapLayer={uiState.layer.map}
            setMapLayer={setMapLayer}
          >
            <GraphCanvas
              width={uiState.splitPanelSizes[0]}
              height={uiState.splitPanelHeight}
              boundingBox={{
                ...calcBoundingRect(sessionState.locations),
                paddingMarginRatio: PADDING_MARGIN_RATIO,
              }}
              setViewportWindow={setSessionViewportWindow}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrag={onDrag}
              onFocus={onFocus}
              onUnfocus={onUnfocus}
              onPointerUp={onPointerUp}
              onClearSelection={onClearSelection}
              draggingIndex={uiState.draggingIndex}
              sessionState={sessionState}
              viewportWindow={uiState.viewportWindow}
              selectedIndices={uiState.selectedIndices}
              focusedIndices={uiState.focusedIndices}
              matrices={matrices}
            />
          </GraphPanel>
        }
        right={
          <ChartPanel
            onChangeChartType={setSessionChartType}
            onChangeScale={setSessionChartScale}
            scale={uiState.chartScale}
            chartType={uiState.chartType}
          >
            <ChartCanvas
              width={uiState.splitPanelSizes[1]}
              height={uiState.splitPanelHeight}
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
        }
      />

      <Box sx={{ margin: '0 2px 0 2px' }}>
        <AppAccordion
          expanded={uiState.countryConfigPanelAccordion}
          onClickSummary={() =>
            setCaseSelectorPanelAccordion(!uiState.countryConfigPanelAccordion)
          }
          summaryAriaControl="parameter-control-panel-content"
          summaryIcon={<LinearScale />}
          summaryTitle={
            <SessionSelectorAccordionSummaryTitle
              title={sessionState.country.title}
            />
          }
        >
          <Typography>{sessionState.country.description}</Typography>
          <CountryConfigPanel
            country={sessionState.country}
            setNumLocations={onUpdateNumLocations}
            setShareManufacturing={setShareManufacturing}
            setTransportationCost={setTransportationCost}
            setElasticitySubstitution={setElasticitySubstitution}
          />
        </AppAccordion>

        <AppAccordion
          expanded={uiState.matrixSetPanelAccordion}
          onClickSummary={() =>
            setDiagonalMatrixSetPanelAccordion(!uiState.matrixSetPanelAccordion)
          }
          lock={uiState.lockMatrixSetPanelAccordion}
          summaryAriaControl="matrices-panel-content"
          summaryIcon={<GridOn />}
          summaryTitle={
            <MatrixSetAccordionSummaryTitle
              locations={sessionState.locations}
              selectedIndices={uiState.selectedIndices}
              focusedIndices={uiState.focusedIndices}
              onUnselect={onUnselect}
              onFocus={onFocus}
              onUnfocus={onUnfocus}
              setLockDiagonalMatrixSetPanelAccordion={
                setLockDiagonalMatrixSetPanelAccordion
              }
            />
          }
        >
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
        </AppAccordion>

        <TimeControlPanel
          timer={timers.simulationTimer}
          isStarted={isSimulationStarted}
          onStart={() => {
            setSessionSimulationTimer(
              startTimer(
                timers.simulationTimer,
                timers.simulationTimer.speed,
                simulationTicker,
                () => {}
              )
            );
          }}
          onStop={() => {
            setSessionSimulationTimer(stopTimer(timers.simulationTimer));
          }}
          onReset={() => {
            setSessionSimulationTimer(resetTimer(timers.simulationTimer));
          }}
          setCounter={(counter: number) => {
            setSessionSimulationTimer({
              ...timers.simulationTimer,
              counter,
            });
          }}
          setSpeed={(speed: number) => {
            setSessionSimulationTimer(
              updateSpeed(
                speed,
                timers.simulationTimer,
                simulationTicker,
                () => {
                  console.log('terminate simulation');
                }
              )
            );
          }}
        />
      </Box>
    </>
  );
});
