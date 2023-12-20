import { MatrixEngineKeyType } from '../apsp/MatrixEngineService';
import { atom } from 'jotai/index';

export type AppPreference = {
  maxRowColLength: number;
  matrixEngineType: MatrixEngineKeyType;
};

export const initialAppPreference: AppPreference = {
  maxRowColLength: 30,
  matrixEngineType: defaultMatrixEngineTyp,
};

export const preferencesAtom = atom(initialAppPreference);
