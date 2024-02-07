import { useAtom } from 'jotai/index';
import {
  downloadStatusAtom,
  downloadSummaryStatusAtom,
} from './GADMGeoJsonServiceAtoms';
import { GADMGeoJsonCountryMetadata } from 'src/app/models/GADMGeoJsonCountryMetadata';
import { v4 as uuid_v4 } from 'uuid';
import { GeoDatabaseTable } from 'src/app/services/database/GeoDatabaseTable';
import { ResourceTypes } from 'src/app/models/ResourceType';
import { GeoDatabase } from 'src/app/services/database/GeoDatabase';
import { fetchFiles, FetchStatus } from '../../Sim/FetchFiles';
import { storeGeoRegions } from 'src/app/services/file/GeoJsonLoaders';
import { LoaderProgressResponse } from 'src/app/services/file/FileLoaderResponse';
import { LoadingProgress } from 'src/app/services/file/LoadingProgress';
import { FileLoadingStatusTypes } from 'src/app/services/file/FileLoadingStatusType';
import { createGADM41JsonUrl } from './CreateGADM41JsonUrl';
import { GeoDatabaseTableTypes } from 'src/app/services/database/GeoDatabaseTableType';

export function useDownloadGADMJsonFiles() {
  const [, setDownloadStatus] = useAtom(downloadStatusAtom);
  const [, setDownloadSummaryProgress] = useAtom(downloadSummaryStatusAtom);

  async function downloadGADMGeoJsonFiles(
    countryMetadataList: GADMGeoJsonCountryMetadata[],
    selectedCheckboxMatrix: boolean[][],
    onFinish: () => void,
  ) {
    const downloadingItems = findDownloadingItems(
      countryMetadataList,
      selectedCheckboxMatrix,
    );

    const uuid = uuid_v4();
    const databaseId = await GeoDatabaseTable.getSingleton().resources.add({
      uuid,
      name: 'GADM GeoJSON',
      description: '',
      type: ResourceTypes.gadmShapes,
      items: downloadingItems,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const db = await GeoDatabase.openWithUUID(
      GeoDatabaseTableTypes.resources,
      uuid,
    );

    requestIdleCallback(async () => {
      await fetchFiles({
        urlList: downloadingItems.map((item) => item.url),
        notifyStatusByURL: (
          url: string,
          urlStatus: { status: FetchStatus },
        ) => {
          setDownloadStatus(
            (draft: Record<string, { status: FetchStatus }>) => {
              return {
                ...draft,
                [url]: urlStatus,
              };
            },
          );
        },

        notifyProgressSummary: ({
          progress,
          loaded,
          total,
        }: {
          progress: number;
          loaded: number;
          total: number;
        }) => {
          setDownloadSummaryProgress((draft: LoadingProgress) => {
            draft.progress = progress;
            draft.loaded = loaded;
            draft.total = total;
            draft.type = FileLoadingStatusTypes.loading;
          });
        },

        notifyFinishedByUrl: async ({
          url,
          data,
        }: {
          url: string;
          data: ArrayBuffer;
        }) => {
          const uint8Array = new Uint8Array(data);
          const stream = new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(uint8Array);
              controller.close();
            },
          });

          await storeGeoRegions({
            db,
            stream,
            fileName: url,
            fileSize: undefined,
            cancelCallback(fileName: string): void {},
            errorCallback(fileName: string, errorMessage: string): void {},
            progressCallback(value: LoaderProgressResponse): void {},
            startedCallback(fileName: string): void {},
            finishedCallback(fileName: string): void {},
          });
        },
      });
      onFinish();
    });
  }

  return { downloadGADMGeoJsonFiles };
}

type DownloadingItem = {
  countryName: string;
  countryCode: string;
  level: number;
  url: string;
};

export function findDownloadingItems(
  countryMetadataList: GADMGeoJsonCountryMetadata[],
  selectedCheckboxMatrix: boolean[][],
): DownloadingItem[] {
  const downloadingItems: DownloadingItem[] = [];

  for (
    let countryIndex = 0;
    countryIndex < countryMetadataList.length;
    countryIndex++
  ) {
    const countryMetadata = countryMetadataList[countryIndex];

    for (let level = 0; level <= countryMetadata.maxLevel; level++) {
      if (
        selectedCheckboxMatrix[countryIndex + 1] &&
        selectedCheckboxMatrix[countryIndex + 1][level + 1]
      ) {
        downloadingItems.push({
          countryName: countryMetadata.countryName,
          countryCode: countryMetadata.countryCode,
          level,
          url: createGADM41JsonUrl(countryMetadata.countryCode, level, false),
        });
      }
    }
  }
  return downloadingItems;
}
