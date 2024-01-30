import { SessionState } from '../../models/SessionState';
import { UIState } from '../../models/UIState';
import { AppMatrices } from '../../models/AppMatrices';
import { City } from '../../models/City';
import { Edge } from '../../models/Graph';
import { useCallback, useState } from 'react';
import {
  removeSubGraph,
  updateAddedSubGraph,
  updateRandomSubGraph,
} from '../../components/SessionPanel/MapPanel/GraphHandlers';
import { isInfinity } from '../../utils/mathUtil';
import { calculateDistanceByLocations } from '../../apsp/calculateDistanceByLocations';
import { isSpherical } from './IsSpherical';
import { globalPixelToTileXYZ } from '../../utils/mortonNumberUtil';
import { arrayXOR, convertIdToIndex } from '../../utils/arrayUtil';

export const useGraphEditActions = ({
  sessionState,
  setSessionState,
  uiState,
  setUIState,
  matrices,
  updateAndSetMatrices,
  //diagonalMatrixSetPanelRef,
}: {
  sessionState: SessionState;
  setSessionState: (
    func: (draft: SessionState) => void,
    commit: boolean,
    label: string,
  ) => void;
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
  matrices: AppMatrices;
  updateAndSetMatrices: (locations: City[], edges: Edge[]) => void;
  //diagonalMatrixSetPanelRef: RefObject<DiagonalMatrixSetPanelHandle>;
}) => {
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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
            draft.parameterSet.numLocations = numLocations;
            draft.locationSerialNumber = locationSerialNumber;
          },
          commit || false,
          'removeBulkLocations',
        );
        updateAndSetMatrices(locations, edges);
        setUIState((draft) => {
          draft.selectedIndices = [];
        });
      });
    },
    [
      sessionState?.locations,
      sessionState?.edges,
      sessionState?.parameterSet?.transportationCost,
    ],
  );

  const onAddLocation = useCallback(() => {
    doAddLocation(sessionState, uiState);
  }, [
    uiState?.selectedIndices,
    sessionState?.locations,
    sessionState?.edges,
    sessionState?.locationSerialNumber,
  ]);

  const doAddLocation = useCallback(
    (sessionState: SessionState, uiState: UIState) => {
      requestAnimationFrame(() => {
        const { locations, edges, locationSerialNumber, addedIndices } =
          updateRandomSubGraph(sessionState, uiState.selectedIndices);

        setSessionState(
          (draft) => {
            draft.locations = locations;
            draft.edges = edges;
            draft.parameterSet.numLocations =
              draft.parameterSet.numLocations + 1;
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
                sessionState,
                uiState.selectedIndices,
                numLocations,
              );
            draft.locations = locations;
            draft.edges = edges;
            draft.parameterSet.numLocations = numLocations;
            draft.locationSerialNumber = locationSerialNumber;
            updateAndSetMatrices(locations, edges);
            setUIState((draft) => {
              draft.selectedIndices = [];
              draft.focusedIndices = addedIndices;
            });
          },
          commit || false,
          'addBulkLocations',
        );
      });
    },
    [uiState, sessionState, setUIState, setSessionState],
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
    [sessionState],
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
                  isSpherical(sessionState),
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
    });
  }, [
    uiState?.selectedIndices,
    sessionState?.locations,
    sessionState?.edges,
    sessionState?.parameterSet?.transportationCost,
    setSessionState,
    matrices?.adjacencyMatrix,
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
  }, [
    uiState?.selectedIndices,
    sessionState?.edges,
    matrices?.predecessorMatrix,
  ]);

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
          draft.parameterSet.numLocations = newLocations.length;
        },
        true,
        'removeLocation',
      );
      updateAndSetMatrices(newLocations, newEdges);
      setUIState((draft) => {
        draft.selectedIndices = [];
      });
    });
  }, []);

  const [XYZ, setXYZ] = useState<{ x: number; y: number; z: number }>({
    x: -122.45,
    y: 37.78,
    z: 10,
  }); // FIXME! this in obsolete state

  const onMoved = useCallback(
    (centerX: number, centerY: number, zoom: number) => {
      const xyz = globalPixelToTileXYZ({ x: centerX, y: centerY }, zoom);
      setXYZ(xyz);
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
                        isSpherical(sessionState),
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
      uiState?.selectedIndices,
      matrices?.adjacencyMatrix,
      sessionState,
      dragStartPosition,
    ],
  );

  const onFocus = useCallback((focusIndices: number[]) => {
    const newFocusedIndices = focusIndices.filter((value) => value != -1);
    /*
    diagonalMatrixSetPanelRef.current?.onFocus(
      focusIndices.map((index) => index + 1),
    );
     */
    setUIState((draft) => {
      draft.focusedIndices = newFocusedIndices;
    });
  }, []);

  const onUnfocus = useCallback((unfocusIndices: number[]) => {
    /*
    diagonalMatrixSetPanelRef.current?.onUnfocus(
      uiState.focusedIndices.map((unfocusIndices) => unfocusIndices + 1),
    );
    diagonalMatrixSetPanelRef.current?.onFocus(
      unfocusIndices.map((unfocusIndex) => unfocusIndex + 1),
    );
     */
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
        /*
        diagonalMatrixSetPanelRef.current?.onSelect(
          prevSelectedIndices,
          newSelectedIndices,
        );
         */
        draft.selectedIndices = newSelectedIndices;
        draft.draggingIndex = null;
      });
      // uiState.selectedIndices = newSelectedIndices;
    },
    [/*diagonalMatrixSetPanelRef.current, */ setUIState],
  );

  const onUnselect = useCallback(
    (prevSelectedIndices: number[], unselectedIndices: number[]) => {
      setUIState((draft) => {
        const newSelectedIndices = prevSelectedIndices.filter(
          (unselectedIndex) => !unselectedIndices.includes(unselectedIndex),
        );
        //diagonalMatrixSetPanelRef.current?.onUnselect(unselectedIndices);
        draft.selectedIndices = newSelectedIndices;
        draft.draggingIndex = null;
      });
    },
    [/*diagonalMatrixSetPanelRef.current, */ setUIState],
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
    [dragStartPosition, onSelect, onUnselect, uiState?.selectedIndices],
  );

  const onClearSelection = useCallback(() => {
    onUnselect(uiState.selectedIndices, uiState.selectedIndices);
  }, [uiState?.selectedIndices]);

  return {
    onAddLocation,
    onAddBulkLocations,
    onRemoveLocation,
    onRemoveBulkLocations,
    onAddEdge,
    onRemoveEdge,
    onMoved,
    XYZ,
    onDragStart,
    onDrag,
    onDragEnd,
    onFocus,
    onUnfocus,
    onSelect,
    onUnselect,
    onPointerUp,
    onClearSelection,
  };
};
