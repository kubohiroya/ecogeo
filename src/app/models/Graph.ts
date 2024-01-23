export type Vertex = {
  id: number;
  point: number[];
};
export type Edge = {
  source: number;
  target: number;
  distance?: number;
};
export type Graph = {
  vertices: Vertex[];
  edges: Edge[];
  spherical: boolean;
};
