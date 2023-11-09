import { render } from '@testing-library/react';

import ChartPanel from './ChartPanel';
import { ChartTypes } from '../../type/ChartTypes';

describe('ChartPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ChartPanel
        chartData={[]}
        chartType={ChartTypes.ShareOfManufacturing}
        onChangeChartType={() => {}}
        onChangeScale={() => {}}
        scale={1}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
