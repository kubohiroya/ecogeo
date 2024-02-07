import JSZip from 'jszip';
import { proxyUrl } from 'src/app/utils/ProxyUrl';
import { readAllChunks } from 'src/app/utils/readerUtil';

export const smartDownloadAsUint8Array = async (url: string) => {
  const localProxyMode = window.location.hostname === 'localhost';
  const base64 = !localProxyMode;
  const res = await fetch(proxyUrl(url, localProxyMode)).catch((error) => {
    throw error;
  });
  if (localProxyMode) {
    const contents = res.body!.getReader();
    const arrayBuffer = await readAllChunks(contents);

    if (url.endsWith('.zip')) {
      return extractUint8ArrayFromZipArrayBuffer(arrayBuffer);
    } else {
      return new Uint8Array(arrayBuffer);
    }
  } else {
    const contents = (await res.json()).contents;
    if (url.endsWith('.zip')) {
      return await extractUint8ArrayFromBase64ZipString(contents);
    } else {
      return new TextEncoder().encode(contents);
    }
  }
};

async function extractUint8ArrayFromBase64ZipString(
  base64Zip: string,
): Promise<Uint8Array> {
  // base64エンコードされたZIPデータをデコード
  const zipData = atob(base64Zip.split('base64,')[1]);
  const zip = new JSZip();
  // ZIPアーカイブを読み込む
  const loadedZip = await zip.loadAsync(zipData, { base64: true });
  // ZIPアーカイブ内のファイル名を取得
  const fileNames = Object.keys(loadedZip.files);
  if (fileNames.length !== 1) {
    throw new Error('ZIPアーカイブは1つのファイルのみを含む必要があります');
  }
  // ZIPアーカイブ内のファイル内容を取得
  return await loadedZip.file(fileNames[0])!.async('uint8array');
}

async function extractUint8ArrayFromZipArrayBuffer(
  arrayBuffer: ArrayBuffer,
): Promise<any> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(arrayBuffer);
  // ZIPアーカイブ内のファイル名を取得
  const fileNames = Object.keys(loadedZip.files);
  if (fileNames.length !== 1) {
    throw new Error('ZIPアーカイブは1つのファイルのみを含む必要があります');
  }
  // ZIPアーカイブ内のファイル内容を取得
  return await loadedZip.file(fileNames[0])!.async('uint8array');
}
