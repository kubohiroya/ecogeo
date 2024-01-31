import { Box, Button } from '@mui/material';
import React from 'react';

export const InputOutputPanel = () => (
  <Box style={{ display: 'flex', gap: '10px' }}>
    <Button variant={'contained'}>Import...</Button>
    <Button variant={'contained'}>Export...</Button>
  </Box>
);