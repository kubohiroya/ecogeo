import JSZip from 'jszip';

export async function unzipFileToStream(file: File): Promise<{
  fileName: string;
  fileSize: number;
  stream: ReadableStream;
  zippedFilePath?: string;
}> {
  if (file.name.endsWith('.zip')) {
    // ZIPファイルの場合
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);

    if (!zipContent.files) {
      throw new Error('Zipファイル内にファイルが見つかりません:' + file.name);
    }
    for (const filePath in zipContent.files) {
      if (!zipContent.files[filePath].dir) {
        const zipFileData = zipContent.files[filePath];
        const blob = await zipFileData.async('blob');
        const stream = blob.stream() as ReadableStream;
        //最初のひとつ
        return {
          fileName: zipFileData.name,
          fileSize: blob.size,
          stream,
          zippedFilePath: file.name,
        };
      }
    }
    throw new Error();
  } else {
    // 通常のファイルの場合
    const stream = file.stream() as ReadableStream;
    return { fileName: file.name, fileSize: file.size, stream };
  }
}
