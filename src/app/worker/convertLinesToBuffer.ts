import { Color } from "@deck.gl/core/typed";

export type LineSource = {
  sourcePositionIDRef: string; // 2
  targetPositionIDRef: string; // 2
  strokeWidth: number; // 4
  strokeColor: Color; // 4
};

export type LineBuffer = {
  buffer: ArrayBuffer;
  indices: ArrayBuffer;
};

export const lineBufferIndexElementSize = 4;
export const lineBufferDatumElementSize = 24;

export function convertLinesToBuffer(
  lines: LineSource[],
  idToPoint2DMap: Map<string, [number, number]>,
): LineBuffer {
  const indices = new ArrayBuffer(lines.length * lineBufferIndexElementSize);
  const indicesView = new DataView(indices);
  const buffer = new ArrayBuffer(lines.length * lineBufferDatumElementSize);
  const view = new DataView(buffer);

  lines.forEach((line, index) => {
    const sourcePosition = idToPoint2DMap.get(line.sourcePositionIDRef);
    const targetPosition = idToPoint2DMap.get(line.targetPositionIDRef);
    if (sourcePosition && targetPosition) {
      const offset = index * lineBufferDatumElementSize;
      indicesView.setUint32(index * lineBufferIndexElementSize, offset, true);
      view.setFloat32(offset, sourcePosition[0], true);
      view.setFloat32(offset + 4, sourcePosition[1], true);
      view.setFloat32(offset + 8, targetPosition[0], true);
      view.setFloat32(offset + 12, targetPosition[1], true);
      view.setFloat32(offset + 16, line.strokeWidth, true);
      view.setUint8(offset + 20, line.strokeColor[0]);
      view.setUint8(offset + 21, line.strokeColor[1]);
      view.setUint8(offset + 22, line.strokeColor[2]);
      view.setUint8(offset + 23, line.strokeColor[3] ?? 255);
    } else {
      throw new Error('Error line:' + index);
    }
  });

  return { buffer, indices };
}
