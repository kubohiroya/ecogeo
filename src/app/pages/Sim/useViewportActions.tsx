import { City } from '~/app/models/City';
import { UIState } from '~/app/models/UIState';
import { useCallback } from 'react';
import { calcBoundingRect } from '~/app/components/SessionPanel/MapPanel/calcBoundingRect';
import { createViewportCenter } from '~/app/components/SessionPanel/MapPanel/CreateViewportCenter';
import { PADDING_MARGIN_RATIO } from '~/app/components/SessionPanel/MapPanel/Constatns';

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
  const doCreateViewportCenter = useCallback(
    (uiState: UIState, locations: City[]): [number, number, number] => {
      if (locations?.length > 1) {
        const boundingRect = calcBoundingRect(locations);
        return createViewportCenter({
          left: boundingRect.left,
          top: boundingRect.top,
          right: boundingRect.right,
          bottom: boundingRect.bottom,
          width,
          height,
          paddingMarginRatio:
            uiState.viewportCenter && uiState.viewportCenter[0] < 1.7
              ? PADDING_MARGIN_RATIO
              : 0.5,
        });
      }
      return uiState.viewportCenter;
    },
    [height, width],
  );

  const onFit = useCallback(() => {
    return doCreateViewportCenter(uiState, locations);
  }, [doCreateViewportCenter, uiState, locations]);

  return { onFit };
};
