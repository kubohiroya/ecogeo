import JSZip from 'jszip';
import { readAllChunks } from '../../utils/readerUtil';
import { proxyUrl } from '../../utils/ProxyUrl';

export const downloadTextData = async (url: string) => {
  const localProxyMode = window.location.hostname === 'localhost';
  const res = await fetch(proxyUrl(url, localProxyMode)).catch((error) => {
    throw error;
  });
  if (localProxyMode) {
    const contents = res.body!.getReader();
    const arrayBuffer = await readAllChunks(contents);
    return new TextDecoder('utf-8').decode(arrayBuffer);
  } else {
    const contents = (await res.json()).contents as string;
    if (url.endsWith('.zip')) {
      return extractStringFromZip(contents);
    } else {
      return contents; // new TextEncoder().encode(contents);
    }
  }
};

async function extractStringFromZip(base64Zip: string): Promise<any> {
  // base64エンコードされたZIPデータをデコード
  const zipData = atob(base64Zip.split('base64,')[1]);
  const zip = new JSZip();

  // ZIPアーカイブを読み込む
  const loadedZip = await zip.loadAsync(zipData, { base64: false });

  // ZIPアーカイブ内のファイル名を取得
  const fileNames = Object.keys(loadedZip.files);
  if (fileNames.length !== 1) {
    throw new Error('ZIPアーカイブは1つのファイルのみを含む必要があります');
  }

  // ZIPアーカイブ内のファイル内容を取得
  return await loadedZip.file(fileNames[0])!.async('string');
}

async function unzip(arrayBuffer: ArrayBuffer): Promise<any> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(arrayBuffer);

  // ZIPアーカイブ内のファイル名を取得
  const fileNames = Object.keys(loadedZip.files);
  if (fileNames.length !== 1) {
    throw new Error('ZIPアーカイブは1つのファイルのみを含む必要があります');
  }

  // ZIPアーカイブ内のファイル内容を取得
  return await loadedZip.file(fileNames[0])!.async('string');
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export enum FetchStatus {
  staged,
  loading,
  success,
  error,
}

export const fetchFiles = async ({
  urlList,
  notifyStatusByURL,
  notifyProgressSummary,
  notifyFinishedByUrl,
}: {
  urlList: string[];
  notifyStatusByURL: (
    url: string,
    urlStatus: { status: FetchStatus; error?: any; retry?: number },
  ) => void;
  notifyProgressSummary: (props: {
    progress: number;
    loaded: number;
    total: number;
  }) => void;
  notifyFinishedByUrl: (props: { url: string; data: ArrayBuffer }) => void;
}): Promise<void> => {
  const retry: Record<string, number> = {};

  let index = 0;

  const total = urlList.length;
  notifyProgressSummary({
    progress: 0,
    loaded: 0,
    total,
  });

  for (const url of urlList) {
    try {
      notifyStatusByURL(url, { status: FetchStatus.loading });
      const arrayBuffer = await downloadTextData(url);
      notifyFinishedByUrl({
        url,
        data: arrayBuffer,
      });
      notifyStatusByURL(url, { status: FetchStatus.success });

      index++;
      notifyProgressSummary({
        loaded: index,
        total,
        progress: Math.round((index / total) * 100),
      });
    } catch (error: any) {
      console.error(error);
      notifyStatusByURL(url, {
        status: FetchStatus.error,
        error,
        retry: retry[url] || 0,
      });
      if (
        error.message.startsWith('Failed to fetch') ||
        error.message.startsWith('Access to fetch')
      ) {
        await delay(3333 + Math.random() * 3333);
        retry[url] = (retry[url] || 0) + 1;
        continue;
      }
    }

    await delay(100 + Math.random() * 500);
  }

  notifyProgressSummary({ progress: 100, loaded: total, total });

  return;
};
