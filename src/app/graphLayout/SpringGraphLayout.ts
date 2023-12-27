import { GraphLayout } from './GraphLayout';
import { Vertex } from '../model/Graph';

export class SpringGraphLayout extends GraphLayout {
  calculateRepulsion(n0: Vertex, n1: Vertex): number[] {
    const dx = n0.point[0] - n1.point[0];
    const dy = n0.point[1] - n1.point[1];
    const dldl = dx * dx + dy * dy;
    const dl = Math.sqrt(dldl);
    if (dl < Number.EPSILON) {
      const randomForces = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ];
      return randomForces[Math.floor(Math.random() * randomForces.length)];
    }
    const g = 1000; // 比例定数 500
    const f = g / dldl; // 2次元での反発は距離に反比例
    return [(f * dx) / dl, (f * dy) / dl];
  }

  calculateAttraction(n0: Vertex, n1: Vertex): number[] {
    const dx = n0.point[0] - n1.point[0];
    const dy = n0.point[1] - n1.point[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < Number.EPSILON) {
      const randomForces = [
        [0, -2],
        [2, 0],
        [0, 2],
        [-2, 0],
      ];
      return randomForces[Math.floor(Math.random() * randomForces.length)];
    }
    const k = 0.01; // ばね定数 0.1
    const l = 100; // ばねの自然長
    const force = -k * (distance - l); // ばねの弾性力
    return [(force * dx) / distance, (force * dy) / distance];
  }
}
