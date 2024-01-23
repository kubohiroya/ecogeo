import { FileLoaderRequestType } from './FileLoaderRequestType';

export type FileLoaderRequest =
  | {
      type: FileLoaderRequestType.start;
      value: {
        dbName: string;
        fileList: FileList;
      };
    }
  | {
      type: FileLoaderRequestType.cancel;
    };
