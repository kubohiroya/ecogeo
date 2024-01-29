import { ViewportCenter } from './ViewportCenter';

export type UIState = {
  viewportCenter: ViewportCenter | null;
  focusedIndices: number[];
  selectedIndices: number[];
  draggingIndex: number | null;
  chartScale: number;
  chartType: string;
  autoLayoutFinished: boolean;
};
