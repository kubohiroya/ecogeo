export function debounce(func: any, waitFor: number) {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: any[]) =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}
