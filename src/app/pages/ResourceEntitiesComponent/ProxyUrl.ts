export const proxyUrl = (url: string, localProxy?: boolean) => {
  return localProxy
    ? url.replace('https://', '/').replace('http://', '/')
    : `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
};
