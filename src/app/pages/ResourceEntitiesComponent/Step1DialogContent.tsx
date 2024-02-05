import { Alert, Box, Button } from '@mui/material';
import { InlineIcon } from '../../../components/InlineIcon/InlineIcon';
import { Launch } from '@mui/icons-material';
import React from 'react';

export function Step1DialogContent(props: { handleClick: () => void }) {
  return (
    <>
      <Alert severity="info">
        The data are freely available for academic use and other non-commercial
        use. Redistribution, or commercial use is not allowed without prior
        permission. See the license for more details.
      </Alert>

      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px',
        }}
      >
        <Button variant={'outlined'} onClick={props.handleClick}>
          <a
            href="https://gadm.org/license.html"
            target="_blank"
            rel="noreferrer"
          >
            See the license
            <InlineIcon>
              <Launch />
            </InlineIcon>
          </a>
        </Button>
      </Box>
    </>
  );
}
