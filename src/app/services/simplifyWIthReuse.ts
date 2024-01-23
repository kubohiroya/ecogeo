import simplify from 'simplify-js';

type Point = { x: number; y: number };

// 間引き情報を保存するマップ
const vertexHistory = new Map<string, boolean>();

function findMaxVertex(vertices: Point[]): Point {
  // 最大の頂点を見つける（ここではx座標が最大のものを選択）
  return vertices.reduce((maxVertex, currentVertex) =>
    currentVertex.x > maxVertex.x ? currentVertex : maxVertex,
  );
}

function reduceVertices(vertices: Point[]): Point[] {
  if (vertices.length <= 2) {
    return vertices;
  }

  const result: Point[] = [vertices[0]];
  let tempSegment: Point[] = [];

  for (let i = 1; i < vertices.length - 1; i++) {
    const vertex = vertices[i];
    const vertexKey = `${vertex.x},${vertex.y}`;

    if (vertexHistory.has(vertexKey)) {
      // 履歴に基づく処理
      result.push(vertex);
      // 新しいセグメントの開始
      if (tempSegment.length > 0) {
        const maxVertex = simplify(tempSegment, 0.1, true);
        result.push(...maxVertex);
        tempSegment = [];
      }
    } else {
      // 新規間引きの範囲を集める
      tempSegment.push(vertex);
    }
  }

  // 最後のセグメントを処理
  if (tempSegment.length > 0) {
    const maxVertex = findMaxVertex(tempSegment);
    result.push(maxVertex);
    vertexHistory.set(`${maxVertex.x},${maxVertex.y}`, true);
  }

  result.push(vertices[vertices.length - 1]);

  return result;
}

/*
const src1 = ['a', 'b', 'b', 'c', 'd', 'd', 'd', 'e', 'f'];
const src2 = ['x', 'y', 'c', 'd', 'd', 'd', 'e', 'f', 'y', 'z'];

const conv = (c: string) => ({
  x: c.charCodeAt(0),
  y: c.charCodeAt(0),
});
const rconv = (code: number) => String.fromCharCode(code);

[src1, src2].forEach((src) => {
  console.log(src);
  console.log(vertexHistory);
  console.log(reduceVertices(src.map(conv)).map((c) => rconv(c.x)));
});
 */
