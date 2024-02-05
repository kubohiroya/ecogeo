import { proxyUrl } from './ProxyUrl';

export const createGADM41JsonUrl = (
  countryCode: string,
  level: number,
  proxyAccessMode: boolean,
) => {
  const url = `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${countryCode}_${level}.json${level === 0 ? '' : '.zip'}`;
  return proxyAccessMode ? proxyUrl(url) : url;
};
