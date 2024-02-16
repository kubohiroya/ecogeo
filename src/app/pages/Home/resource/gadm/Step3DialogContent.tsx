import { GADMGeoJsonCountryMetadata } from '~/app/models/GADMGeoJsonCountryMetadata';
import { Alert, Box, CircularProgress, FormGroup } from '@mui/material';
import { GADMGeoJsonSelector } from './GADMGeoJsonSelector';
import React from 'react';

import { GADMGeoJsonSelectorCounter } from './GADMGeoJsonSelectorCounter';

export function Step3DialogContent(props: {
  LEVEL_MAX: number;
  countryMetadataList: GADMGeoJsonCountryMetadata[];
  checkboxMatrix: boolean[][];
  onChange: (draft: boolean[][]) => void;
  urlList: string[];
}) {
  return (
    <FormGroup>
      <Alert severity="info">
        Select some countries and levels to be downloaded into your resource.
        You can select multiple files from different countries and levels.
      </Alert>
      {!props.countryMetadataList || props.countryMetadataList.length === 0 ? (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '8px',
          }}
        >
          <CircularProgress variant="indeterminate" />
        </Box>
      ) : (
        <>
          <GADMGeoJsonSelector
            levelMax={props.LEVEL_MAX}
            countryMetadataList={props.countryMetadataList}
            checkboxMatrix={props.checkboxMatrix}
            onChange={props.onChange}
          />
          <GADMGeoJsonSelectorCounter urlList={props.urlList} />
        </>
      )}
    </FormGroup>
  );
}
