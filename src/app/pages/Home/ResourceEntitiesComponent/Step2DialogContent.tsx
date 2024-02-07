import { Alert, Box, Button } from '@mui/material';
import React from 'react';
import { StepStatus, StepStatuses } from './StepStatuses';
import LoadingButton from '@mui/lab/LoadingButton';

export function Step2DialogContent(props: {
  handleClick: () => Promise<void>;
  stepStatus: StepStatus[];
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
        {props.stepStatus[1] === StepStatuses.processing && (
          <LoadingButton size="large" variant="outlined" loading={true}>
            Loading...
          </LoadingButton>
        )}
        {props.stepStatus[1] !== StepStatuses.processing && (
          <Button
            size="large"
            variant="outlined"
            onClick={props.handleClick}
            disabled={props.stepStatus[1] !== StepStatuses.display}
          >
            {props.stepStatus[1] === StepStatuses.display
              ? 'Download the Index'
              : props.stepStatus[1] === StepStatuses.onLeaveTask
                ? 'download the index file...'
                : 'finished, go next!'}
          </Button>
        )}
      </Box>
    </>
  );
}
