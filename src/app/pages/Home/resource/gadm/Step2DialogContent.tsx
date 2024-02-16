import { Alert, Box, Button } from '@mui/material';
import React from 'react';
import { StepStatus, StepStatuses } from './StepStatuses';
import { Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

export function Step2DialogContent(props: {
  handleClick: () => Promise<void>;
  stepStatus: (StepStatus | null)[];
}) {
  return (
    <>
      <Alert severity="info">
        Next, you are going to download the index file which contains a list of
        countries and its shapes available. It will be used to download the
        shape files.
      </Alert>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px',
        }}
      >
        {props.stepStatus[1] !== StepStatuses.processing &&
        props.stepStatus[1] === StepStatuses.display ? (
          <Button
            size="large"
            variant="contained"
            onClick={props.handleClick}
            disabled={props.stepStatus[1] !== StepStatuses.display}
            endIcon={<Download />}
          >
            Download the index file
          </Button>
        ) : props.stepStatus[1] === StepStatuses.processing ? (
          <LoadingButton
            style={{ width: '250px' }}
            size="large"
            variant="outlined"
            disabled={true}
            loading
            endIcon={<Download />}
            loadingPosition="end"
          >
            Downloading
          </LoadingButton>
        ) : (
          <Button size="large" variant="outlined" disabled={true}>
            Download completed, go next!
          </Button>
        )}
      </Box>
    </>
  );
}
