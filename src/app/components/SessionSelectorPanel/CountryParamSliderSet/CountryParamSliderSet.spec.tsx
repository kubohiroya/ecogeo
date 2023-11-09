import { render } from '@testing-library/react';

import CountryParamSliderSet from './CountryParamSliderSet';

describe('ParamSliderSet', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CountryParamSliderSet
        elasticitySubstitution={1}
        transportationCost={1}
        shareManufacturing={0.1}
        numRegions={12}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
