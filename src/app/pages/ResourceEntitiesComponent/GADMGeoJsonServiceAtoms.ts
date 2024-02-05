import { atom } from 'jotai/index';
import { createGADM41GeoJsonUrlList } from './GADMGeoJsonIndexService';
import { atomWithImmer } from 'jotai-immer';
import { GADMGeoJsonCountryMetadata } from '../../models/GADMGeoJsonCountryMetadata';
import { FetchStatus } from './FetchFiles';
import { LoadingProgress } from '../../services/file/LoadingProgress';
import { FileLoadingStatusTypes } from '../../services/file/FileLoadingStatusType';

const initialSelectedMatrix: boolean[][] = [];
export const selectedCheckboxMatrixAtom = atomWithImmer(initialSelectedMatrix);
export const selectedDataMatrixAtom = atom((get) => {
  return get(selectedCheckboxMatrixAtom)
    .slice(1)
    .map((row) => row.slice(1));
});
export const numSelectedAtom = atom((get) => {
  return get(selectedDataMatrixAtom)
    .flat()
    .filter((item) => item).length;
});
export const urlListAtom = atom((get) => {
  return createGADM41GeoJsonUrlList(
    get(geoJsonCountryMetadataListAtom),
    get(selectedDataMatrixAtom),
    false,
  );
});
export const urlListToStringAtom = atom((get) => {
  return get(urlListAtom).join('\n');
});
const initialGeoJsonCountryMetadataList: GADMGeoJsonCountryMetadata[] = [];
const initialGeoJsonCountryMetadataMap: Map<
  string,
  GADMGeoJsonCountryMetadata
> = new Map();
export const geoJsonCountryMetadataListAtom = atom(
  initialGeoJsonCountryMetadataList,
);
export const geoJsonCountryMetadataMapAtom = atom(
  initialGeoJsonCountryMetadataMap,
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
