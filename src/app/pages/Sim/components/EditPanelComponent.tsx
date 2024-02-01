import { Box, Button } from '@mui/material';
import React from 'react';

export const EditPanelComponent = () => (
  <Box style={{ display: 'flex', gap: '10px' }}>
    <Button variant={'contained'}>AddNode</Button>
    <Button variant={'contained'}>RemoveNode</Button>
    <Button variant={'contained'}>AddRoute</Button>
    <Button variant={'contained'}>RemoveRoute</Button>
  </Box>
);
