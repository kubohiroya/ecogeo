import JSZip from 'jszip';
import { readAllChunks } from '../../utils/readerUtil';
import { GADMGeoJsonCountryMetadata } from '../../models/GADMGeoJsonCountryMetadata';
import { download } from './FetchFiles';
import { createGADM41JsonUrl } from './CreateGADM41JsonUrl';
import { createGADM41IndexUrl } from './CreateGADM41IndexUrl';

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

export const downloadGeoJsonIndexFile = async (): Promise<
  GADMGeoJsonCountryMetadata[]
> => {
  const arrayBuffer = await download(createGADM41IndexUrl());
  const body = new TextDecoder('utf-8').decode(arrayBuffer);
  //const contents = JSON.parse(body);
  const regex = /<option value="([^"]+)_(.+?)_(\d+)">(.+?)<\/option>/g;

  const results: GADMGeoJsonCountryMetadata[] = [];
  let match;

  while ((match = regex.exec(body)) !== null) {
    const [_, id, name, level] = match;
    results.push({
      countryCode: id,
      countryName: name,
      maxLevel: parseInt(level, 10) - 1,
    } as GADMGeoJsonCountryMetadata);
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

export function createGADM41GeoJsonUrlList(
  countries: GADMGeoJsonCountryMetadata[],
  selection: boolean[][],
  proxyAccessMode: boolean,
) {
  const urlList: string[] = [];
  for (let index = 0; index < countries.length; index++) {
    const country = countries[index];
    for (let level = 0; level <= country.maxLevel; level++) {
      if (selection[index] && selection[index][level]) {
        urlList.push(
          createGADM41JsonUrl(country.countryCode, level, proxyAccessMode),
        );
      }
    }
  }
  return urlList;
}
