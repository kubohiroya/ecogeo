export type Vertex = {
  id: number;
  x: number;
  y: number;
};
export type Edge = {
  source: number;
  target: number;
  distance?: number;
};
export type Graph = {
  vertices: Vertex[];
  edges: Edge[];
};
