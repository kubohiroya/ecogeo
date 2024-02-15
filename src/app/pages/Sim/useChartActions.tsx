import { UIState } from '~/app/models/UIState';
import { useCallback } from 'react';

export const useChartActions = ({
  setUIState,
}: {
  setUIState: (func: (draft: UIState) => void) => void;
}) => {
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

  return { setSessionChartScale, setSessionChartType };
};
