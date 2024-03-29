import { GADMGeoJsonCountryMetadata } from '~/app/models/GADMGeoJsonCountryMetadata';
import {
  Alert,
  Box,
  CircularProgress,
  FormGroup,
  Typography,
} from '@mui/material';
import { GADMGeoJsonSelector } from './GADMGeoJsonSelector';
import { InlineIcon } from 'src/components/InlineIcon/InlineIcon';
import { TextCopyComponent } from 'src/components/TextCopyComponent/TextCopyComponent';
import React from 'react';
import { DownloadDone } from '@mui/icons-material';

export function Step3DialogContent(props: {
  countryMetadataList: GADMGeoJsonCountryMetadata[];
  LEVEL_MAX: number;
  numSelected: number;
  urlListToString: string;
  onChange: () => void;
}) {
  return (
    <FormGroup>
      <Alert severity="info">
        Select the shape files to download. You can select multiple files from
        different countries and levels.
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
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '8px',
            }}
          >
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <DownloadDone />
          </Box>
          <Box>
            <GADMGeoJsonSelector
              countryMetadataList={props.countryMetadataList}
              levelMax={props.LEVEL_MAX}
              onChange={props.onChange}
            />
            {props.numSelected > 0 && (
              <Box
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography>
                  {props.numSelected +
                    (props.numSelected > 1 ? ' files' : ' file') +
                    ' selected'}{' '}
                  <InlineIcon>
                    <TextCopyComponent text={props.urlListToString} />
                  </InlineIcon>
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </FormGroup>
  );
}
