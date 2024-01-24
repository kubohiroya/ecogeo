import { Button } from '@mui/material';
import { useCallback } from 'react';

export const GADMFetch = () => {
  const onClick = useCallback(async () => {}, []);
  return (
    <Button variant={'outlined'} onClick={onClick}>
      Download ADM Files
    </Button>
  );
};
