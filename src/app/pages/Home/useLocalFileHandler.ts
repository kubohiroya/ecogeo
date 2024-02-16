import { useNavigate } from 'react-router-dom';
import { uuid_v4 } from '~/app/utils/uuidUtil';
import { convertFileListToFileArray } from '~/app/utils/fileListUtil';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import { ResourceTypes } from '~/app/models/ResourceType';
import { GeoDatabase } from '~/app/services/database/GeoDatabase';
import { storeGadmGeoJsons } from '~/app/services/file/GeoJsonLoaders';
import { LoaderProgressResponse } from '~/app/services/file/FileLoaderResponse';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { convertFileNameToResourceItem } from '~/app/pages/Home/resource/gadm/CreateGADM41JsonUrl';
import JSZip from 'jszip';

function uint8ArrayToReadableStream(uint8Array: Uint8Array) {
  // 新しいReadableStreamインスタンスを返す
  return new ReadableStream({
    // start、pull、cancelのメソッドを持つコントローラーを定義する
    start(controller) {
      // ストリームにデータを追加
      controller.enqueue(uint8Array);
      // データの追加が完了したことを示す
      controller.close();
    },
  });
}

// ReadableStream<Uint8Array>からBlobを作成する関数
async function streamToBlob(readableStream: ReadableStream<Uint8Array>) {
  const chunks = [];
  const reader = readableStream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return new Blob(chunks);
}

async function extractFirstFileFromZip(zipStream: ReadableStream<Uint8Array>) {
  const zipBlob = await streamToBlob(zipStream); // ZIPデータのBlobを取得
  // BlobをArrayBufferに変換
  const zipArrayBuffer = await zipBlob.arrayBuffer();

  const jszip = new JSZip();
  const zipContents = await jszip.loadAsync(zipArrayBuffer); // ZIPファイルを読み込む
  const fileNames = Object.keys(zipContents.files);

  if (fileNames.length === 0) {
    throw new Error('ZIPファイルにはファイルが含まれていません。');
  }

  // 最初のファイルの内容を取得
  const firstFileName = fileNames[0];
  const firstFile = zipContents.files[firstFileName];
  // Uint8Array形式でファイルの内容を取得
  return await firstFile.async('uint8array');
}

export const useLocalFileHandler = () => {
  const navigate = useNavigate();

  const handleFiles = async (fileList: FileList) => {
    const uuid = uuid_v4();

    const files = convertFileListToFileArray(fileList);

    function isGadmGeoJsonFile(file: File): boolean {
      return (
        file.name.startsWith('gadm') &&
        (file.name.endsWith('json') || file.name.endsWith('json.zip'))
      );
    }

    function isGenericGeoJsonFile(file: File): boolean {
      return (
        !file.name.startsWith('gadm') &&
        (file.name.endsWith('json') || file.name.endsWith('json.zip'))
      );
    }

    function isGadmGeoJsonFiles(files: File[]) {
      return files.every((file) => isGadmGeoJsonFile(file));
    }

    function isGenericGeoJsonFiles(files: File[]) {
      return files.every((file) => isGenericGeoJsonFile(file));
    }

    function isCityFile(file: File): boolean {
      return (
        (file.name.startsWith('cities') || file.name.startsWith('city')) &&
        (file.name.endsWith('csv') || file.name.endsWith('csv.zip'))
      );
    }

    function isCityFiles(files: File[]) {
      return files.every((file) => isCityFile(file));
    }

    function isRouteFile(file: File): boolean {
      return (
        (file.name.startsWith('routes') || file.name.startsWith('route')) &&
        (file.name.endsWith('csv') || file.name.endsWith('csv.zip'))
      );
    }

    function isRouteFiles(files: File[]) {
      return files.every((file) => isRouteFile(file));
    }

    const [tableType, resourceType] = isGadmGeoJsonFiles(files)
      ? [GeoDatabaseTableTypes.resources, ResourceTypes.gadmGeoJson]
      : isGenericGeoJsonFiles(files)
        ? [GeoDatabaseTableTypes.resources, ResourceTypes.genericGeoJson]
        : isCityFiles(files)
          ? [GeoDatabaseTableTypes.resources, ResourceTypes.idegsmCities]
          : isRouteFiles(files)
            ? [GeoDatabaseTableTypes.resources, ResourceTypes.idegsmRoutes]
            : [null, null];

    if (tableType === null || resourceType === null) {
      const fileNames = files.map((file) => file.name).join(', ');
      throw new Error(fileNames);
    }

    const items = files.map((file) => convertFileNameToResourceItem(file.name));

    console.log('processing: ', items);

    await GeoDatabaseTable.getSingleton().resources.add({
      uuid,
      name: 'GADM GeoJSON',
      description: 'import from local',
      type: ResourceTypes.gadmGeoJson,
      items,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const db = await GeoDatabase.openWithUUID(
      GeoDatabaseTableTypes.resources,
      uuid,
    );

    switch (resourceType) {
      case ResourceTypes.gadmGeoJson:
        for (let i = 0; i < fileList.length; i++) {
          const zipMode = fileList[i].name.endsWith('zip');
          const stream = zipMode
            ? uint8ArrayToReadableStream(
                await extractFirstFileFromZip(fileList[i].stream()),
              )
            : fileList[i].stream();

          await storeGadmGeoJsons({
            db,
            stream,
            fileName: fileList[i].name,
            fileSize: undefined,
            startedCallback: (fileName: string, dbName: string) => {},
            progressCallback: (value: LoaderProgressResponse) => {},
            cancelCallback: (fileName: string) => {},
            finishedCallback: (fileName: string) => {
              console.log('finished: ', fileName);
            },
          });
        }
        return navigate(
          `/resources/update/${ResourceTypes.gadmGeoJson}/${uuid}`,
        );
      default:
        throw new Error('unimplemented resource type');
    }
  };

  return { handleFiles };
};
