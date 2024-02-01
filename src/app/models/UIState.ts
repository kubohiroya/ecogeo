export type UIState = {
  viewportCenter: [number, number, number];
  focusedIndices: number[];
  selectedIndices: number[];
  draggingIndex: number | null;
  chartScale: number;
  chartType: string;
  autoLayoutFinished: boolean;
};
