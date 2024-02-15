import { Alert, Box, Button } from '@mui/material';
import React from 'react';
import { StepStatus, StepStatuses } from './StepStatuses';
import { Download } from '@mui/icons-material';

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
        {props.stepStatus[1] !== StepStatuses.processing &&
        props.stepStatus[1] === StepStatuses.display ? (
          <Button
            size="large"
            variant="contained"
            onClick={props.handleClick}
            disabled={props.stepStatus[1] !== StepStatuses.display}
            endIcon={<Download />}
          >
            Download the Index
          </Button>
        ) : (
          <Button size="large" variant="outlined" disabled={true}>
            finished, go next!
          </Button>
        )}
      </Box>
    </>
  );
}
