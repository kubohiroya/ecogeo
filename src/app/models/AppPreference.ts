import { atom } from 'jotai/index';
import {
  defaultMatrixEngineType,
  MatrixEngineKeyType,
} from './MatrixEngineKeyTypes';

export type AppPreference = {
  maxRowColLength: number;
  matrixEngineType: MatrixEngineKeyType;
};

export const initialAppPreference: AppPreference = {
  maxRowColLength: 30,
  matrixEngineType: defaultMatrixEngineType,
};

export const preferencesAtom = atom(initialAppPreference);
