import React, { useEffect, useRef } from 'react';
import { Chip } from '@mui/material';

export const SelectNodeChip = ({
  nodeId,
  focused,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}: {
  nodeId: number;
  focused: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseUp: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.addEventListener('mouseenter', onMouseEnter);
    ref.current?.addEventListener('mouseleave', onMouseLeave);
  }, []);
  return (
    <Chip
      ref={ref}
      size="small"
      label={nodeId}
      sx={{
        marginRight: '2px',
        backgroundColor: focused ? '#ff0' : '#dd0',
        color: focused ? '#f00' : '#000',
        '&:hover': {
          color: '#f00',
          backgroundColor: '#ff0',
        },
      }}
      onClick={onMouseUp}
    />
  );
};
