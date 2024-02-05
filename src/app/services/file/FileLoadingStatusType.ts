export const FileLoadingStatusTypes = {
  idle: 'idle',
  started: 'started',
  loading: 'loading',
  finished: 'finished',
  error: 'error',
};

export type FileLoadingStatusType =
  (typeof FileLoadingStatusTypes)[keyof typeof FileLoadingStatusTypes];
