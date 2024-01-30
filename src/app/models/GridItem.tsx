import ReactGridLayout from 'react-grid-layout';
import { GridItemResources } from './GridItemResources';

export type GridItem = {
  layout: ReactGridLayout.Layout;
  resource: GridItemResources;
};
