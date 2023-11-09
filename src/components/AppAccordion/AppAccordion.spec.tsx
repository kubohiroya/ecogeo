import { render } from '@testing-library/react';

import AppAccordion from './AppAccordion';
import { Box, Grid } from '@mui/material';
import React from 'react';

describe('AppAccordion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AppAccordion
        summaryIcon={<Grid />}
        summaryAriaControl={''}
        children={null}
        expanded
        onClickSummary={() => {}}
        summaryTitle={<Box />}
      ></AppAccordion>
    );
    expect(baseElement).toBeTruthy();
  });
});
