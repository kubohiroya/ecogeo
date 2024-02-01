import { FileLoaderResponseType } from './FileLoaderResponseType';

export type CsvLoaderBaseResponse = {
  fileName: string;
  fileSize?: number;
  index: number;
  total: number;
  unit: string;
  progress: number;
  errorMessage?: string;
};
export type LoaderStartedResponse = CsvLoaderBaseResponse & {
  type: FileLoaderResponseType.started;
};
export type LoaderProgressResponse = CsvLoaderBaseResponse & {
  type: FileLoaderResponseType.progress;
};
export type LoaderErrorResponse = CsvLoaderBaseResponse & {
  type: FileLoaderResponseType.error;
};
export type LoaderCancelResponse = CsvLoaderBaseResponse & {
  type: FileLoaderResponseType.cancel;
};

export type FileLoaderResponse =
  | LoaderStartedResponse
  | LoaderProgressResponse
  | LoaderErrorResponse
  | LoaderCancelResponse;
