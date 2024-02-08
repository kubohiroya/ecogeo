import React from 'react';

import { GridItemType } from './GridItemType';

export type FloatingItemResource = {
  id: string;
  type: GridItemType;
  icon?: React.ReactNode;
  tooltip?: string;
  title?: string;
  titleBarMode?: 'win' | 'mac';
  rowHeight?: number;
  x?: number;
  y?: number;
  shown?: boolean;
};
