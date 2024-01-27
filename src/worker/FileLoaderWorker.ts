/// <reference lib="webworker" />

import { LoaderProgressResponse } from '../app/services/file/FileLoaderResponse';
import { FileLoaderRequest } from '../app/services/file/FileLoaderRequest';
import { FileLoaderRequestType } from '../app/services/file/FileLoaderRequestType';
import { FileLoaderResponseType } from '../app/services/file/FileLoaderResponseType';
import {
  CsvLoaders,
  GeoCsvLoaders,
  loadCsvFile,
} from '../app/services/file/GeoCsvLoaders';
import { GeoPointEntity } from '../app/models/geo/GeoPointEntity';
import { storeGeoRegions } from '../app/services/file/GeoJsonLoaders';
import { unzipFileToStream } from '../app/services/file/UnzipFileToStream';
import { GeoDatabase } from '../app/services/database/GeoDatabase';

let workerBusy: boolean = false;

function processFileListsToFiles(fileList: FileList) {
  const files = [];
  for (let index = 0; index < fileList.length; index++) {
    const file = fileList.item(index);
    if (file) {
      files.push(file);
    }
  }
  return files;
}

const startedCallback = (fileName: string) => {
  self.postMessage({
    value: {
      type: FileLoaderResponseType.started,
      fileName,
    },
  });
};

const progressCallback = (value: LoaderProgressResponse) => {
  self.postMessage({
    value,
  });
};

const allDoneCallback = () => {
  self.postMessage({
    value: {
      type: FileLoaderResponseType.allDone,
    },
  });
};

const errorCallback = (fileName: string, errorMessage: string) => {
  self.postMessage({
    value: {
      type: FileLoaderResponseType.error,
      fileName,
      errorMessage,
    },
  });
};

const cancelCallback = (fileName: string) => {
  self.postMessage({
    value: {
      type: FileLoaderResponseType.cancel,
      fileName,
    },
  });
};

const loadFileList = async (
  db: GeoDatabase,
  fileList: FileList,
  csvLoaders: CsvLoaders,
) => {
  // loadWorkerStatus = FileLoadingStatus.loading;

  const files = processFileListsToFiles(fileList);

  for (const prefix of ['cities', 'routes']) {
    await Promise.all(
      files
        .filter((file) => {
          const filename = file.name.toLowerCase();
          return filename.startsWith(prefix) && filename.endsWith('.csv');
        })
        .map(async (file) =>
          loadCsvFile<GeoPointEntity>({
            db,
            stream: (await unzipFileToStream(file)).stream,
            fileName: file.name,
            fileSize: file.size,
            csvLoaders,
            startedCallback,
            progressCallback,
            errorCallback,
            cancelCallback,
          }),
        ),
    );
  }

  await Promise.all(
    files
      .filter((file) => {
        const filename = file.name.toLowerCase();
        return (
          filename.startsWith('gadm') &&
          (filename.endsWith('.json') || filename.endsWith('.json.zip'))
        );
      })
      .map(async (file) => {
        return storeGeoRegions({
          db,
          stream: (await unzipFileToStream(file)).stream,
          fileName: file.name,
          fileSize: file.size,
          startedCallback,
          progressCallback,
          errorCallback,
          cancelCallback,
        });
      }),
  )
    .catch((error) => {
      console.error(error);
    })
    .then(() => {
      // allDoneCallback();
    });
};

self.onmessage = async function fileLoaderWorker(
  event: MessageEvent<FileLoaderRequest>,
) {
  const payload = event.data;
  switch (payload.type) {
    case FileLoaderRequestType.start:
      if (!workerBusy) {
        workerBusy = true;
        const dbName = payload.value.dbName;
        console.log(dbName);
        const db = new GeoDatabase(dbName);
        await loadFileList(
          db,
          (event.data as any).data as FileList,
          GeoCsvLoaders,
        );
        workerBusy = false;
      }
      break;
  }
};
