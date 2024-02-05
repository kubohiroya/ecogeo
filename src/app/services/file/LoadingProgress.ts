import { FileLoadingStatusType } from './FileLoadingStatusType';

export type LoadingProgress = {
  type: FileLoadingStatusType;
  progress: number;
  loaded: number;
  total: number;
};
