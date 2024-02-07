import { proxyUrl } from 'src/app/utils/ProxyUrl';
import { ResourceItem } from 'src/app/models/ResourceItem';

import countries from './GADMCountries.json';

export const createGADM41JsonUrl = (
  countryCode: string,
  level: number,
  proxyAccessMode: boolean,
) => {
  const url = `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${countryCode}_${level}.json${level === 0 ? '' : '.zip'}`;
  return proxyAccessMode ? proxyUrl(url) : url;
};

export const convertFileNameToResourceItem = (
  fileName: string,
): ResourceItem => {
  //gadm41_${countryCode}_${level}.json
  const [_, body] = fileName.split('gadm41_');
  const [countryCode, level_suffix] = body.split('_');
  const [level, suffix] = level_suffix.split('.');
  return {
    url: 'file:///' + fileName,
    countryName: Array.from(countries).find(
      (country) => country.code === countryCode,
    )!.name,
    countryCode: countryCode,
    level: parseInt(level),
  };
};
