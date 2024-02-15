import { Alert, Box, Button } from '@mui/material';
import { InlineIcon } from 'src/components/InlineIcon/InlineIcon';
import { Launch } from '@mui/icons-material';
import React from 'react';
import {
  StepStatus,
  StepStatuses,
} from '~/app/pages/Home/ResourceEntitiesComponent/StepStatuses';

export function Step1DialogContent(props: {
  stepStatus: StepStatus[];
  handleClick: () => void;
}) {
  return (
    <>
      <Alert severity="info">
        The data are freely available for academic use and other non-commercial
        use. Redistribution, or commercial use is not allowed without prior
        permission. See the <a href="https://gadm.org/license.html">license</a>{' '}
        for more details.
      </Alert>

      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px',
        }}
      >
        <Button
          size={'large'}
          variant={'contained'}
          onClick={props.handleClick}
          disabled={props.stepStatus[0] !== StepStatuses.display}
        >
          {props.stepStatus[0] === StepStatuses.display ? (
            <a
              style={{ textDecoration: 'none', color: 'white' }}
              href="https://gadm.org/license.html"
              target="_blank"
              rel="noreferrer"
            >
              See the license
              <InlineIcon>
                <Launch />
              </InlineIcon>
            </a>
          ) : (
            <span>
              See the license
              <InlineIcon>
                <Launch />
              </InlineIcon>
            </span>
          )}
        </Button>
      </Box>
    </>
  );
}
