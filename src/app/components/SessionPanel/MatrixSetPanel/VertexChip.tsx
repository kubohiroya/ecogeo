import React, { useEffect, useRef } from 'react';
import { Chip, Tooltip } from '@mui/material';

export const VertexChip = ({
  index,
  label,
  focused,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}: {
  index: number;
  label: string;
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
    <Tooltip title={`#${index}`} placement="top">
      <Chip
        ref={ref}
        size="small"
        label={label}
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
    </Tooltip>
  );
};
