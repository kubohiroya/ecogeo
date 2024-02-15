import { Color } from "@deck.gl/core/typed";

export type CircleSource = {
  id: string; // no for store
  centerPosition: [number, number]; // 8
  radius: number; // 4
  strokeWidth: number; // 4
  strokeColor: Color; // 4
  fillColor: Color; // 4
};

export const circleBufferElementSize = 24;

export function convertCirclesToBuffer(circles: CircleSource[]): ArrayBuffer {
  const buffer = new ArrayBuffer(circles.length * circleBufferElementSize);
  const view = new DataView(buffer);

  circles.forEach((circle, index) => {
    const offset = index * circleBufferElementSize;
    view.setFloat32(offset, circle.centerPosition[0], true);
    view.setFloat32(offset + 4, circle.centerPosition[1], true);
    view.setFloat32(offset + 8, circle.radius, true);
    view.setFloat32(offset + 12, circle.strokeWidth, true);
    view.setUint8(offset + 16, circle.strokeColor[0]);
    view.setUint8(offset + 17, circle.strokeColor[1]);
    view.setUint8(offset + 18, circle.strokeColor[2]);
    view.setUint8(offset + 19, circle.strokeColor[3] ?? 255);
    view.setUint8(offset + 20, circle.fillColor[0]);
    view.setUint8(offset + 21, circle.fillColor[1]);
    view.setUint8(offset + 22, circle.fillColor[2]);
    view.setUint8(offset + 23, circle.fillColor[3] ?? 255);
  });
  return buffer;
}
