import { useAtom } from 'jotai/index';
import {
  downloadStatusAtom,
  downloadSummaryStatusAtom,
} from './GADMGeoJsonServiceAtoms';
import { GADMGeoJsonCountryMetadata } from '~/app/models/GADMGeoJsonCountryMetadata';
import { v4 as uuid_v4 } from 'uuid';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { fetchFiles, FetchStatus } from '~/app/services/file/FetchFiles';
import { storeGeoRegions } from '~/app/services/file/GeoJsonLoaders';
import { LoaderProgressResponse } from '~/app/services/file/FileLoaderResponse';
import { LoadingProgress } from '~/app/services/file/LoadingProgress';
import { FileLoadingStatusTypes } from '~/app/services/file/FileLoadingStatusType';
import { createGADM41JsonUrl } from './CreateGADM41JsonUrl';
import { ResourceTypes } from '~/app/models/ResourceType';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { GeoDatabase } from '~/app/services/database/GeoDatabase';
import { ResourceItem } from '~/app/models/ResourceItem';

export function useDownloadGADMJsonFiles() {
  const [, setDownloadStatus] = useAtom(downloadStatusAtom);
  const [, setDownloadSummaryProgress] = useAtom(downloadSummaryStatusAtom);

  async function downloadGADMGeoJsonFiles(
    countryMetadataList: GADMGeoJsonCountryMetadata[],
    selectedCheckboxMatrix: boolean[][],
    onFinish: () => void,
  ): Promise<string> {
    const downloadingItems = findDownloadingItems(
      countryMetadataList,
      selectedCheckboxMatrix,
    );

    const uuid = uuid_v4();

    await GeoDatabaseTable.getSingleton().resources.add({
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
        onStatusChange: (url: string, urlStatus: { status: FetchStatus }) => {
          setDownloadStatus(
            (draft: Record<string, { status: FetchStatus }>) => {
              return {
                ...draft,
                [url]: urlStatus,
              };
            },
          );
        },

        onSummaryChange: ({
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

        onLoad: async ({ url, data }: { url: string; data: ArrayBuffer }) => {
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

    return uuid;
  }

  return { downloadGADMGeoJsonFiles };
}

export function findDownloadingItems(
  countryMetadataList: GADMGeoJsonCountryMetadata[],
  selectedCheckboxMatrix: boolean[][],
): ResourceItem[] {
  const downloadingItems: ResourceItem[] = [];

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
