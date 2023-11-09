import { Typography } from '@mui/material';
import React from 'react';
import { countryDefaults } from './store/countryDefaults';

export const CaseSelectorAccordionSummaryTitle = ({
  selectedCaseId,
}: {
  selectedCaseId: string;
}) => {
  return (
    <>
      <Typography sx={{ fontSize: '110%', margin: '0 12px 0 12px' }}>
        Case :
      </Typography>
      <Typography sx={{ fontSize: '110%', color: 'rgb(25,118,210)' }}>
        {countryDefaults.find((c) => c.id == selectedCaseId)?.title}
      </Typography>
    </>
  );
};
