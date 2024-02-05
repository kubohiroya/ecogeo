import React from 'react';
import { Box, LinearProgress, LinearProgressProps } from '@mui/material';

export function LinearProgressWithLabel(
  props: LinearProgressProps & {
    loaded: number;
    total: number;
  },
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 180 }}>
        {props.total > 0 &&
          `${props.loaded} / ${props.total} (${Math.round((100 * props.loaded) / props.total)} %)`}
      </Box>
    </Box>
  );
}
