export const MatrixEngineKeyTypes = {
  GPUMatrixEngine: 'GPUFloydWarshall',
  CPUMatrixEngine: 'CPUFloydWarshall',
} as const;
export type MatrixEngineKeyType =
  (typeof MatrixEngineKeyTypes)[keyof typeof MatrixEngineKeyTypes];

export const defaultMatrixEngineType = MatrixEngineKeyTypes.CPUMatrixEngine;

const params = new URLSearchParams(window.location.search);
//const matrixEngineType = params.get('engine') || 'CPU:FloydWarshall';
export const matrixEngineType = params.get('engine') || defaultMatrixEngineType;
