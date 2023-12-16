import { Typography } from '@mui/material';
import React from 'react';

export const SessionSelectorAccordionSummaryTitle = ({
  title,
}: {
  title: string;
}) => {
  return (
    <>
      <Typography sx={{ fontSize: '110%', margin: '0 12px 0 12px' }}>
        Case :
      </Typography>
      <Typography sx={{ fontSize: '110%', color: 'rgb(25,118,210)' }}>
        {title}
      </Typography>
    </>
  );
};
