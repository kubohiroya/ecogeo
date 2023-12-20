import "split-pane-react/esm/themes/default.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { preferencesAtom } from "../../model/AppPreference";
import { useAtomValue } from "jotai";
import { useSessionStateUndoRedo } from "./UseSessionStateUndoRedo";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { DiagonalMatrixSetPanelHandle, MatrixSetPanel } from "./MatrixSetPanel/MatrixSetPanel";
import { SpringGraphLayout } from "../../graphLayout/SpringGraphLayout";
import { GraphPanelButtonsState } from "./GraphPanel/GraphPanelButtonsState";
import { arrayXOR, convertIdToIndex } from "../../util/arrayUtil";
import { calculateDistanceByLocations } from "../../apsp/calculateDistanceByLocations";
import { City, resetCity } from "../../model/City";
import { calcBoundingRect } from "./GraphPanel/calcBoundingRect";
import { createViewportWindow } from "./GraphPanel/CreateViewportWindow";
import { PADDING_MARGIN_RATIO } from "./GraphPanel/Constatns";
import { removeSubGraph, updateAddedSubGraph, updateRandomSubGraph } from "./GraphPanel/GraphHandlers";
import { Edge } from "../../model/Graph";
import { isInfinity } from "../../util/mathUtil";
import { ViewportWindow } from "../../model/ViewportWindow";
import { Box, LinearProgress, Snackbar, Typography } from "@mui/material";
import { SessionLayoutPanel } from "./SessionLayoutPanel";
import AppAccordion from "../../../components/AppAccordion/AppAccordion";
import { GridOn, LinearScale } from "@mui/icons-material";
import { SessionSelectorAccordionSummaryTitle } from "./SessionSelectorAccordionSummaryTitle";
import CountryConfigPanel from "./CountryConfigPanel/CountryConfigPanel";
import { MatrixSetAccordionSummaryTitle } from "./MatrixSetPanel/MatrixSetAccordionSummaryTitle";
import TimeControlPanel from "./TimeControPanel/TimeControlPanel";
import GraphPanel from "./GraphPanel/GraphPanel";
import { GraphCanvas } from "./GraphPanel/GraphCanvas";
import { ChartCanvas } from "./ChartPanel/ChartCanvas";
import { ChartPanel } from "./ChartPanel/ChartPanel";
import { UIState } from "../../model/UIState";
import useIntervalExpScale from "../../hooks/useIntervalExpScape";
import { startSimulation, tickSimulator } from "../../model/Simulator";
import { GraphLayoutTickResult } from "../../graphLayout/GraphLayout";
import { SessionRenameDialog } from "./SessionRenameDialog";
import { getMatrixEngine } from "../../apsp/MatrixEngineService";

type SessionPanelProps = {
  sessionId: string;
  openRenameDialog: boolean;
  closeRenameDialog: () => void;
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
    stagig,
  } = useSessionStateUndoRedo(sessionId);

  const autoGraphLayoutEngine: SpringGraphLayout = new SpringGraphLayout();

  const updateAndSetMatrices = (locations: City[], edges: Edge[]) => {
    updateMatrices(
      sessionId,
      locations,
      edges,
      sessionState.country.transportationCost
    ).then((newMatrices) => {
      setMatrices((draft) => {
        draft.adjacencyMatrix = newMatrices.adjacencyMatrix;
        draft.distanceMatrix = newMatrices.distanceMatrix;
        draft.predecessorMatrix = newMatrices.predecessorMatrix;
        draft.transportationCostMatrix = newMatrices.transportationCostMatrix;
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
      uiState.draggingIndex
    );

    setSessionState(
      (draft) => {
        graphLayoutTickResult.locations.forEach((city, index) => {
          draft.locations[index].x = city.x;
          draft.locations[index].y = city.y;
        });
        const idToIndexMap = new Map<number, number>(
          draft.locations.map((city, index) => [city.id, index])
        );
        draft.edges.forEach((edge, index) => {
          const source = draft.locations[idToIndexMap.get(edge.source)!];
          const target = draft.locations[idToIndexMap.get(edge.target)!];
          draft.edges[index].distance = calculateDistanceByLocations(
            source,
            target
          );
        });
      },
      graphLayoutTickResult.maximumVelocity < 1.0,
      'autoLayout'
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
          true,
         "simulationStart"'
        )
      });
    },
    onReset: () => {
      requestAnimationFrame(() => {
        console.log("reset");
        setSessionState(
          (draft) => {
            draft.locations.forEach((location) =>
              resetCity(location, draft.locations.length)
            );
          },
          true,
          "simulationReset"
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
          "simulationTick"
        );
      });
      return true;
    },
    isFinished: (result: boolean): boolean => {
      return false;
    },
    onFinished: (result: boolean) => {
      requestAnimationFrame(() => {
        setSessionState((draft) => {}, false, "simulationFinished");
      });
    },
    minInterval: 10,
    maxInterval: 3000,
    initialIntervalScale: 0.5
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
      openSnackBar("No more undo!");
      return;
    }
    undo();
  });
  useHotkeys(['Shift+Meta+z', 'Shift+Control+z'], () => {
    if (future.length == 0) {
      openSnackBar("No more redo!");
      return;
    }
    redo();
  });

  useHotkeys(["h"], () => {
    console.log({
      numLocations: sessionState.locations.length,
      locations: sessionState.locations,
      selectedIndices: uiState.selectedIndices
    });
    console.log({ history, staging, future });
    //console.log({ uiState });
  });
  useHotkeys(["e"], () => {
    console.log(JSON.stringify(sessionState.edges, null, " "));
  });

  const diagonalMatrixSetPanelRef = useRef<DiagonalMatrixSetPanelHandle>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

  const setNumLocations = useCallback(
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
      if (
        dragStartPosition == null ||
        (Math.abs(dragStartPosition.x - x) <= 1.0 &&
          Math.abs(dragStartPosition.y - y) <= 1.0)
      ) {
        return;
      }
      requestAnimationFrame(async () => {
        setUIState((draft) => {
          draft.draggingIndex = null;
          draft.focusedIndices = [];
        });
        setDragStartPosition(null);
        setSessionState((draft) => {
        }, true, "dragEnd");
        updateAndSetMatrices(sessionState.locations, sessionState.edges);
      });
    },
    [
      sessionState,
      setSessionState,
      setUIState,
      setMatrices,
      setDragStartPosition,
      updateAndSetMatrices
    ]
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
            },
            false,
            "drag"
          );
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
      setUIState((draft) => {
        const newSelectedIndices = arrayXOR(
          prevSelectedIndices,
          selectedIndices
        ).sort();
        diagonalMatrixSetPanelRef.current?.onSelect(
          prevSelectedIndices,
          newSelectedIndices
        );
        draft.selectedIndices = newSelectedIndices;
        draft.draggingIndex = null;
      });
      // uiState.selectedIndices = newSelectedIndices;
    },
    [diagonalMatrixSetPanelRef.current, setUIState]
  );

  const onUnselect = useCallback(
    (prevSelectedIndices: number[], unselectedIndices: number[]) => {
      setUIState((draft) => {
        const newSelectedIndices = prevSelectedIndices.filter(
          (unselectedIndex) => !unselectedIndices.includes(unselectedIndex)
        );
        diagonalMatrixSetPanelRef.current?.onUnselect(unselectedIndices);
        draft.selectedIndices = newSelectedIndices;
        draft.draggingIndex = null;
      });
    },
    [diagonalMatrixSetPanelRef.current, setUIState]
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
    [dragStartPosition, onSelect, onUnselect, uiState.selectedIndices]
  );

  const onClearSelection = useCallback(() => {
    onUnselect(uiState.selectedIndices, uiState.selectedIndices);
  }, [uiState.selectedIndices]);

  const fit = useCallback(
    (uiState: UIState, locations: City[]) => {
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
    },
    [uiState.viewportWindow, uiState.splitPanelSizes, uiState.splitPanelHeight]
  );

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
        setSessionState(
          (draft) => {
            draft.locations = locations;
            draft.edges = edges;
            draft.country.numLocations = numLocations;
            draft.locationSerialNumber = locationSerialNumber;
          },
          commit,
          "removeBulkLocations"
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
    ]
  );

  const onAddLocation = useCallback(async () => {
    requestAnimationFrame(async () => {
      const { locations, edges, locationSerialNumber, addedIndices } =
        updateRandomSubGraph(sessionId, sessionState, uiState.selectedIndices);

      setSessionState(
        (draft) => {
          draft.locations = locations;
          draft.edges = edges;
          draft.country.numLocations = draft.country.numLocations + 1;
          draft.locationSerialNumber = locationSerialNumber;
        },
        true,
        "addLocation"
      );
      updateAndSetMatrices(locations, edges);
      setUIState((draft) => {
        draft.focusedIndices = [...uiState.selectedIndices];
        draft.selectedIndices = [...addedIndices];
      });
    });
  }, [
    uiState.selectedIndices,
    sessionState.locations,
    sessionState.edges,
    sessionState.locationSerialNumber,
    setUIState
  ]);

  const onAddBulkLocations = useCallback(
    (numLocations: number, commit?: boolean) => {
      requestAnimationFrame(async () => {
        setSessionState(
          (draft) => {
            const { locations, edges, locationSerialNumber, addedIndices } =
              updateAddedSubGraph(
                sessionId,
                sessionState,
                uiState.selectedIndices,
                numLocations
              );
            draft.locations = locations;
            draft.edges = edges;
            draft.country.numLocations = numLocations;
            draft.locationSerialNumber = locationSerialNumber;
            updateAndSetMatrices(locations, edges);
            setUIState((draft) => {
              // draft.viewportWindow = fit(draft, locations);
              draft.selectedIndices = [];
              draft.focusedIndices = addedIndices;
            });
          },
          commit,
          "addBulkLocations"
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
      setSessionState
    ]
  );

  const updateRemovedEdges = useCallback(
    (
      selectedIndices: number[],
      edges: Edge[],
      predecessorMatrix: number[][] | null
    ) => {
      if (!predecessorMatrix) {
        return [];
      }

      const selectedIdSet = new Set<number>(
        selectedIndices.map(
          (selectedIndex) => sessionState.locations[selectedIndex]?.id
        )
      );

      return edges.filter(
        (edge) =>
          !selectedIdSet.has(edge.source) && !selectedIdSet.has(edge.target)
      );
    },
    [sessionState.locations]
  );

  const updateRemovedPath = useCallback(
    (
      sourceIndex: number,
      targetIndex: number,
      edges: Edge[],
      predecessorMatrix: number[][] | null
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
            sessionState.locations[nextIndex].id
          )
        );
        sourceIndex = nextIndex;
      }

      return edges.filter(
        (edge, index) => !removingEdgeSet.has(getKey(edge.source, edge.target))
      );
    },
    [sessionState]
  );

  const onAddEdge = useCallback(async () => {
    requestAnimationFrame(async () => {
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
                const distance = calculateDistanceByLocations(source, target);
                const edge = {
                  source: source.id,
                  target: target.id,
                  distance
                };
                newEdges.push(edge);
              }
            }
          }
          draft.edges = [...draft.edges, ...newEdges];
          updateAndSetMatrices(sessionState.locations, sessionState.edges);
        },
        true,
        "addEdge"
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
    setUIState
  ]);

  const onRemoveEdge = useCallback(() => {
    if (uiState.selectedIndices.length == 2) {
      const newEdges = updateRemovedPath(
        uiState.selectedIndices[0],
        uiState.selectedIndices[1],
        sessionState.edges,
        matrices.predecessorMatrix
      );
      setSessionState(
        (draft) => {
          draft.edges = newEdges;
        },
        true,
        "removePath"
      );
    } else {
      const newEdges = updateRemovedEdges(
        uiState.selectedIndices,
        sessionState.edges,
        matrices.predecessorMatrix
      );
      setSessionState(
        (draft) => {
          draft.edges = newEdges || [];
        },
        true,
        "removeEdge"
      );
    }
  }, [uiState.selectedIndices, sessionState.edges, matrices.predecessorMatrix]);

  const onRemoveLocation = useCallback(async () => {
    requestAnimationFrame(async () => {
      const newEdges =
        updateRemovedEdges(
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
          manufacturingShare: city.manufactureShare * ratio,
          agricultureShare: city.agricultureShare * ratio
        }));

      setSessionState(
        (draft) => {
          draft.locations = newLocations;
          draft.edges = newEdges;
          draft.country.numLocations = newLocations.length;
        },
        true,
        "removeLocation"
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
    setSessionState
  ]);

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
    updateAndSetMatrices(sessionState.locations, sessionState.edges);
  }, [
    sessionState.locations,
    sessionState.edges,
    sessionState.country.transportationCost,
    setMatrices,
  ]);

  const setShareManufacturing = useCallback(
    (shareManufacturing: number, commit?: boolean) => {
      setSessionState(
        (draft) => {
          draft.country.manufactureShare = shareManufacturing;
        },
        commit,
        "updateCountry"
      );
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
      setSessionState(
        (draft) => {
          draft.country.transportationCost = transportationCost;
        },
        commit,
        "updateCountry"
      );
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
      setSessionState(
        (draft) => {
          draft.country.elasticitySubstitution = elasticitySubstitution;
        },
        commit,
        "updateCountry"
      );
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
      addLocation: !simulation.isStarted,
      removeLocation:
        !simulation.isStarted && uiState.selectedIndices.length > 0,
      addEdge: !simulation.isStarted && uiState.selectedIndices.length >= 2,
      removeEdge: !simulation.isStarted && uiState.selectedIndices.length >= 2,
      autoGraphLayout: !autoGraphLayoutTimer.isStarted,
      mapLayer: true,
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
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
    message: string;
  }>({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: ""
  });

  const openSnackBar = useCallback(
    (message: string) => {
      setSnackBarState({ ...snackBarState, open: true, message });
    },
    [snackBarState, setSnackBarState]
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
    [autoGraphLayoutTimer.isStarted, autoGraphLayoutTimer.intervalScale]
  );

  useEffect(() => {
    document.title = `GEO-ECO: ${sessionState.country.title} - Geological Economics Modeling Simulator`;
  }, [sessionState.country.title]);

  return (
    <>
      {simulation.isStarted ? (
        <LinearProgress color="primary" />
      ) : autoGraphLayoutTimer.isStarted ? (
        <LinearProgress color="warning" />
      ) : (
        <Box sx={{ height: '4px' }} />
      )}
      <SessionRenameDialog
        open={props.openRenameDialog}
        onClose={props.closeRenameDialog}
        onRename={(newName: string) => {
          requestAnimationFrame(() => {
            setSessionState(
              (draft) => {
                draft.country.title = newName;
              },
              true,
              "renameSession"
            );
            props.closeRenameDialog();
          });
        }}
        name={sessionState.country.title}
      />
      <Snackbar
        anchorOrigin={{
          vertical: snackBarState.vertical,
          horizontal: snackBarState.horizontal
        }}
        open={snackBarState.open}
        onClose={closeSnackBar}
        message={snackBarState.message}
      />
      <SessionLayoutPanel
        uiState={uiState}
        setUIState={setUIState}
        left={
          <GraphPanel
            hideGraphEditButtons={simulation.isStarted}
            state={graphPanelButtonState}
            onFit={onFit}
            onAddLocation={onAddLocation}
            onRemoveLocation={onRemoveLocation}
            onAddEdge={onAddEdge}
            onRemoveEdge={onRemoveEdge}
            onUndo={undo}
            onRedo={redo}
            onToggleAutoGraphLayout={onToggleAutoGraphLayout}
            autoGraphLayoutStarted={autoGraphLayoutTimer.isStarted}
            autoGraphLayoutSpeed={autoGraphLayoutTimer.intervalScale}
            setAutoGraphLayoutSpeed={setAutoGraphLayoutIntervalScale}
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
            setNumLocations={setNumLocations}
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
          counter={simulation.counter}
          isStarted={simulation.isStarted}
          onStart={simulation.start}
          onStop={simulation.stop}
          onReset={simulation.reset}
          intervalScale={simulation.intervalScale}
          changeIntervalScale={simulation.changeIntervalScale}
        />
      </Box>
    </>
  );
});
