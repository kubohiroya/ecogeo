export const GridItemTypes = {
  Background: 'Background',
  FloatingButton: 'FloatingButton',
  FloatingPanel: 'FloatingPanel',
} as const;

export type GridItemType = (typeof GridItemTypes)[keyof typeof GridItemTypes];
