import { Box, Button } from '@mui/material';
import React from 'react';
import { FileDownload, FileUpload } from '@mui/icons-material';

export const InputOutputPanelComponent = () => (
  <Box style={{ display: 'flex', gap: '10px' }}>
    <Button
      variant={'contained'}
      startIcon={<FileUpload />}
      title={'Import a simulation from a file'}
    >
      Import
    </Button>
    <Button
      variant={'contained'}
      startIcon={<FileDownload />}
      title={'Export a simulation from a file'}
    >
      Export
    </Button>
  </Box>
);
