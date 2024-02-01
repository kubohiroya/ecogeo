export const GridItemTypes = {
  BackgroundPanel: 'BackgroundPanel',
  FloatingButton: 'FloatingButton',
  FloatingPanel: 'FloatingPanel',
} as const;

export type GridItemType = (typeof GridItemTypes)[keyof typeof GridItemTypes];
