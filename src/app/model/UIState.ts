import { ViewportCenter } from "./ViewportCenter";
import { AppLayer } from "./AppLayer";

export type UIState = {
  viewportCenter: ViewportCenter | null;
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
