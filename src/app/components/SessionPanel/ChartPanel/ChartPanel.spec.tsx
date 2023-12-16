import { render } from '@testing-library/react';

import ChartPanel from './ChartPanel';
import { ChartType } from '../../../type/ChartType';

describe('ChartPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ChartPanel
        chartType={ChartType.ShareOfManufacturing}
        onChangeChartType={() => {}}
        onChangeScale={() => {}}
        scale={1}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
