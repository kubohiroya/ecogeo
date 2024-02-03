import JSZip from 'jszip';
import { readAllChunks } from '../../utils/readerUtil';

const allOriginDownload = async (url: string) => {
  const command = url.endsWith('.zip') ? 'get' : 'get';
  const res = await fetch(
    `https://api.allorigins.win/${command}?url=${encodeURIComponent(url)}`,
    {
      method: 'GET',
    },
  ).catch((error) => {
    throw error;
  });
  return await readAllChunks(res.body!.getReader());
};

const download = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
  }).catch((error) => {
    throw error;
  });
  return await readAllChunks(res.body!.getReader());
};

export type GADMCountryMetadata = {
  code: string;
  name: string;
  level: number;
};

export const fetchGADMCountries = async (): Promise<GADMCountryMetadata[]> => {
  const arrayBuffer = await download(gadm41IndexUrl(true));
  const body = new TextDecoder('utf-8').decode(arrayBuffer);
  //const contents = JSON.parse(body);
  const regex = /<option value="([^"]+)_(.+?)_(\d+)">(.+?)<\/option>/g;

  const results: GADMCountryMetadata[] = [];
  let match;

  while ((match = regex.exec(body)) !== null) {
    const [_, id, name, level] = match;
    results.push({
      code: id,
      name,
      level: parseInt(level, 10) - 1,
    } as GADMCountryMetadata);
  }
  return results;
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

async function extractZip(arrayBuffer: ArrayBuffer): Promise<any> {
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

export function createGADM41GeoJsonUrlList(
  countries: GADMCountryMetadata[],
  selection: boolean[][],
  proxyAccessMode: boolean,
) {
  const urlList: string[] = [];
  for (let index = 0; index < countries.length; index++) {
    const country = countries[index];
    for (let level = 0; level <= country.level; level++) {
      if (selection[index] && selection[index][level]) {
        urlList.push(gadm41JsonUrl(country.code, level, proxyAccessMode));
      }
    }
  }
  return urlList;
}

export const fetchFiles = async (
  //countries: GADMCountryMetadata[],
  urlList: string[],
  notifyStatus: (
    url: string,
    urlStatus: { status: FetchStatus; error?: any; retry?: number },
  ) => void,
  notifyProgress: (props: {
    progress: number;
    index: number;
    total: number;
  }) => void,
  notifyFinish: (props: { url: string; data: ArrayBuffer }) => void,
): Promise<void> => {
  const retry: Record<string, number> = {};

  const index = 0;
  const total = urlList.length;
  notifyProgress({
    progress: 0,
    index: 0,
    total,
  });
  for (const url of urlList) {
    try {
      notifyStatus(url, { status: FetchStatus.loading });
      const arrayBuffer = await download(url);
      if (url.endsWith('.zip')) {
        const contents = await extractZip(arrayBuffer);
        notifyFinish({
          url,
          data: contents,
        });
      } else {
        notifyFinish({
          url,
          data: arrayBuffer,
        });
      }
      notifyStatus(url, { status: FetchStatus.success });
    } catch (error: any) {
      console.error(error);
      notifyStatus(url, {
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
    notifyProgress({
      progress: ((index + 1) / total) * 100,
      index: index + 1,
      total,
    });

    await delay(100 + Math.random() * 500);
  }
  notifyProgress({ progress: 100, index: total, total });
  return;
};

export const proxyUrl = (url: string) => {
  return url.replace('https://', '/').replace('http://', '/');
};

export const gadm41JsonUrl = (
  countryCode: string,
  level: number,
  proxyAccessMode: boolean,
) => {
  const url = `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${countryCode}_${level}.json${level === 0 ? '' : '.zip'}`;
  return proxyAccessMode ? proxyUrl(url) : url;
};

export const gadm41IndexUrl = (proxyAccessMode: boolean) => {
  const url = 'https://gadm.org/download_country.html';
  return proxyAccessMode ? proxyUrl(url) : url;
};
