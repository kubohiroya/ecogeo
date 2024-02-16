import { atom } from 'jotai/index';
import { atomWithImmer } from 'jotai-immer';
import { GADMGeoJsonCountryMetadata } from '~/app/models/GADMGeoJsonCountryMetadata';
import { FetchStatus } from '~/app/services/file/FetchFiles';
import { LoadingProgress } from '~/app/services/file/LoadingProgress';
import { FileLoadingStatusTypes } from '~/app/services/file/FileLoadingStatusType';

const initialGeoJsonCountryMetadataList: GADMGeoJsonCountryMetadata[] = [];
export const geoJsonCountryMetadataListAtom = atom(
  initialGeoJsonCountryMetadataList,
);

const initialDownloadStatus: Record<
  string,
  { status: FetchStatus; retry?: number }
> = {};
export const downloadStatusAtom = atom(initialDownloadStatus);

const loadingProgressStatus: LoadingProgress = {
  progress: 0,
  total: 0,
  loaded: 0,
  type: FileLoadingStatusTypes.loading,
};

export const downloadSummaryStatusAtom = atomWithImmer(loadingProgressStatus);
