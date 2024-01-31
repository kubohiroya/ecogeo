import JSZip from "jszip";

/**
 * FileList内のファイルを調べ、指定された拡張子と一致するファイルの内容を読み出すためのReadableStreamの配列を返す関数。
 *
 * @param files FileListオブジェクト
 * @param extension 探すべきファイルの拡張子
 * @returns Promise<ReadableStream<Uint8Array>[]>
 */
export async function extractStreams(
  files: FileList,
  extension: string,
): Promise<ReadableStream<Uint8Array>[]> {
  const streams: ReadableStream<Uint8Array>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.name.endsWith(extension)) {
      streams.push(file.stream());
    } else if (file.name.endsWith('.zip')) {
      const zipStreams = await extractFromZip(file, extension);
      streams.push(...zipStreams);
    }
  }

  return streams;
}

/**
 * Zipファイルから、指定された拡張子を持つファイルの内容を読み出すためのReadableStreamの配列を返す関数。
 *
 * @param zipFile Zip形式のFileオブジェクト
 * @param extension 探すべきファイルの拡張子
 * @returns Promise<ReadableStream<Uint8Array>[]>
 */
export async function extractFromZip(
  zipFile: File,
  extension: string,
): Promise<ReadableStream<Uint8Array>[]> {
  const zip = new JSZip();
  const content = await zip.loadAsync(zipFile);
  const streams: ReadableStream<Uint8Array>[] = [];

  for (const fileName in content.files) {
    if (
      // @ts-expect-error
      content.files.hasOwnProperty(fileName) &&
      fileName.endsWith(extension)
    ) {
      const fileData = await content.files[fileName].async('uint8array');
      streams.push(
        new ReadableStream({
          start(controller) {
            controller.enqueue(fileData);
            controller.close();
          },
        }),
      );
    }
  }

  return streams;
}
