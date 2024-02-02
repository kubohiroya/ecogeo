import { FileLoaderRequestType } from './FileLoaderRequestType';

export type FileLoaderRequest =
  | {
      type: FileLoaderRequestType.start;
      value: {
        dbName: string;
        file: File;
      };
    }
  | {
      type: FileLoaderRequestType.cancel;
    };
