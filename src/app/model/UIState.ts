import { ViewportWindow } from './ViewportWindow';
import { AppLayer } from './AppLayer';

export type UIState = {
  viewportWindow: ViewportWindow | null;
  splitPanelSizes: number[];
  splitPanelHeight: number;

  focusedIndices: number[];
  selectedIndices: number[];
  draggingIndex: number | null;

  countryConfigPanelAccordion: boolean;
  matrixSetPanelAccordion: boolean;
  lockMatrixSetPanelAccordion: boolean;

  chartScale: number;
  chartType: string;

  autoLayoutFinished: boolean;

  layer: AppLayer;
};
