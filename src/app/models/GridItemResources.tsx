import React from 'react';

import { GridItemType } from './GridItemType';

export interface GridItemResources {
  id: string;
  type: GridItemType;
  icon?: React.ReactNode;
  tooltip?: string;
  title?: string;
  titleBarMode?: 'win' | 'mac';
  rowHeight?: number;
  shown?: boolean;
  enabled?: boolean;
  children?: React.ReactNode;
  bindToPanelId?: string;
  bindToButtonId?: string;
  navigateTo?: string;
}
