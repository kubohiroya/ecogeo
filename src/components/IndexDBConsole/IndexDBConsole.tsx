import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { GeoDatabase } from '../../app/services/database/GeoDatabase';

export const IndexDBConsole = ({ db }: { db: GeoDatabase }) => {
  const handleDelete = useCallback(() => {
    db.countries.clear();
    db.regions1.clear();
    db.regions2.clear();
    db.points.clear();
  }, []);
  return (
    <Box>
      <Button variant="outlined" onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  );
};
