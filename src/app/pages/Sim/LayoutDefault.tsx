export type LayoutDefault = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  enabled?: boolean;
  shown?: boolean;
  height?: number; // FIXME: rename this to be 'clientHeight'
  onClick?: () => void;
};
