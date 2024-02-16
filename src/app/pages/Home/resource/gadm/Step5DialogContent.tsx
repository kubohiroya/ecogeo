import { Alert, Box, Slider } from '@mui/material';
import React from 'react';

export function Step5DialogContent(props: {
  setSimplifyLevel: (value: ((prevState: number) => number) | number) => void;
}) {
  return (
    <>
      <Alert severity="info">
        Simplify polygons to reduce heavy load of CPU/Memory/Storage.
      </Alert>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px',
        }}
      >
        <Slider
          sx={{ width: '70%' }}
          min={0}
          defaultValue={3}
          max={6}
          step={1}
          marks={[
            { value: 0, label: '0.1 (Low Quality)' },
            { value: 1, label: '0.05' },
            { value: 2, label: '0.01' },
            { value: 3, label: '0.005' },
            { value: 4, label: '0.001' },
            { value: 5, label: '0.0005' },
            { value: 6, label: '0.0001 (High Quality)' },
          ]}
          onChangeCommitted={(e, value) => {
            props.setSimplifyLevel(value as number);
          }}
        />
      </Box>
    </>
  );
}
