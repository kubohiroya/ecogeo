import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { ProjectDB } from '../../app/services/project/ProjectDB';

export const IndexDBConsole = ({ db }: { db: ProjectDB }) => {
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
