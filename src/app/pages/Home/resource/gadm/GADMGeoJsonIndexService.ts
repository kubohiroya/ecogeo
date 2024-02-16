import { createGADM41JsonUrl } from './CreateGADM41JsonUrl';
import { createGADMIndexUrl } from './CreateGADMIndexUrl';
import { GADMGeoJsonCountryMetadata } from '~/app/models/GADMGeoJsonCountryMetadata';
import { smartDownloadAsUint8Array } from '~/app/utils/zipUtil';

export const downloadGeoJsonIndexFile = async (): Promise<
  GADMGeoJsonCountryMetadata[]
> => {
  const arrayBuffer = await smartDownloadAsUint8Array(createGADMIndexUrl());
  //const contents = JSON.parse(body);
  const regex = /<option value="([^"]+)_(.+?)_(\d+)">(.+?)<\/option>/g;

  const results: GADMGeoJsonCountryMetadata[] = [];
  let match;

  const contents = new TextDecoder('utf-8').decode(arrayBuffer);

  while ((match = regex.exec(contents)) !== null) {
    const [_, id, name, level] = match;
    results.push({
      countryCode: id,
      countryName: name,
      maxLevel: parseInt(level, 10) - 1,
    } as GADMGeoJsonCountryMetadata);
  }
  return results;
};

export function createGADM41GeoJsonUrlList(
  countries: GADMGeoJsonCountryMetadata[],
  checkboxMatrix: boolean[][],
  proxyAccessMode: boolean,
) {
  const urlList: string[] = [];
  for (let countryIndex = 0; countryIndex < countries.length; countryIndex++) {
    const country = countries[countryIndex];
    for (let level = 0; level <= country.maxLevel; level++) {
      if (
        countryIndex + 1 < checkboxMatrix.length &&
        level + 1 < checkboxMatrix[countryIndex + 1].length &&
        checkboxMatrix[countryIndex + 1][level + 1]
      ) {
        urlList.push(
          createGADM41JsonUrl(country.countryCode, level, proxyAccessMode),
        );
      }
    }
  }
  return urlList;
}
