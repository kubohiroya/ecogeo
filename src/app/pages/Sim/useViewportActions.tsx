import { City } from '../../models/City';
import { UIState } from '../../models/UIState';
import { useCallback, useLayoutEffect } from 'react';
import { calcBoundingRect } from '../../components/SessionPanel/MapPanel/calcBoundingRect';
import { createViewportCenter } from '../../components/SessionPanel/MapPanel/CreateViewportCenter';
import { PADDING_MARGIN_RATIO } from '../../components/SessionPanel/MapPanel/Constatns';

export const useViewportActions = ({
  width,
  height,
  locations,
  uiState,
  setUIState,
}: {
  width: number;
  height: number;
  locations: City[];
  uiState: UIState;
  setUIState: (func: (draft: UIState) => void) => void;
}) => {
  const doCreateViewportCenter = (uiState: UIState, locations: City[]) => {
    if (locations?.length > 1) {
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
    requestAnimationFrame(() => {
      setUIState((draft) => {
        draft.viewportCenter = doCreateViewportCenter(draft, locations);
      });
    });
  }, [locations]);

  useLayoutEffect(() => {
    if (uiState?.viewportCenter == null) {
      onFit();
    }
  }, []);

  return { onFit };
};
