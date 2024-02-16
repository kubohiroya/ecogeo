import { Box, Typography } from '@mui/material';
import React, { memo } from 'react';
import { InlineIcon } from '~/components/InlineIcon/InlineIcon';
import { TextCopyComponent } from '~/components/TextCopyComponent/TextCopyComponent';

export const GADMGeoJsonSelectorCounter = memo(
  ({ urlList }: { urlList: string[] }) => {
    if (urlList.length === 0) {
      return null;
    }

    return (
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
          {urlList.length +
            (urlList.length > 1 ? ' files' : ' file') +
            ' selected'}{' '}
          <InlineIcon>
            <TextCopyComponent createText={() => urlList.join('\n')} />
          </InlineIcon>
        </Typography>
      </Box>
    );
  },
);
