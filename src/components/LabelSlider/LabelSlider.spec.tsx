import { render } from '@testing-library/react';

import LabelSlider from './LabelSlider';
import React from 'react';
import { Computer } from '@mui/icons-material';

describe('ParamSlider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <LabelSlider
        value={0}
        icon={<Computer />}
        label={''}
        title={''}
        min={0}
        max={10}
        step={0.1}
        marks={[]}
        onChange={() => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
