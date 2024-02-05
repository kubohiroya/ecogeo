export const proxyUrl = (url: string) => {
  return url.replace('https://', '/').replace('http://', '/');
};
