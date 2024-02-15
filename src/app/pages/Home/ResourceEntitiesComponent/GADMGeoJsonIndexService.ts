import { createGADM41JsonUrl } from "./CreateGADM41JsonUrl";
import { createGADM41IndexUrl } from "./CreateGADM41IndexUrl";
import { GADMGeoJsonCountryMetadata } from "~/app/models/GADMGeoJsonCountryMetadata";
import { smartDownloadAsUint8Array } from "~/app/utils/zipUtil";

export const downloadGeoJsonIndexFile = async (): Promise<
  GADMGeoJsonCountryMetadata[]
> => {
  const arrayBuffer = await smartDownloadAsUint8Array(createGADM41IndexUrl());
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
