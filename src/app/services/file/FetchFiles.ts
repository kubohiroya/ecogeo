import { smartDownloadAsUint8Array } from "~/app/utils/zipUtil";

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
  onStatusChange,
  onSummaryChange,
  onLoad,
}: {
  urlList: string[];
  onStatusChange: (
    url: string,
    urlStatus: { status: FetchStatus; error?: any; retry?: number },
  ) => void;
  onSummaryChange: (props: {
    progress: number;
    loaded: number;
    total: number;
  }) => void;
  onLoad: (props: { url: string; data: ArrayBuffer }) => void;
}): Promise<void> => {
  const retry: Record<string, number> = {};

  let index = 0;

  const total = urlList.length;
  onSummaryChange({
    progress: 0,
    loaded: 0,
    total,
  });

  for (const url of urlList) {
    try {
      onStatusChange(url, { status: FetchStatus.loading });
      const arrayBuffer = await smartDownloadAsUint8Array(url);
      onLoad({
        url,
        data: arrayBuffer,
      });
      onStatusChange(url, { status: FetchStatus.success });

      index++;
      onSummaryChange({
        loaded: index,
        total,
        progress: Math.round((index / total) * 100),
      });
    } catch (error: any) {
      console.error(error);
      onStatusChange(url, {
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

  onSummaryChange({ progress: 100, loaded: total, total });

  return;
};
