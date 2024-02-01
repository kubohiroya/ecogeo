import { render } from '@testing-library/react';

import { ChartPane } from './ChartPane';
import { ChartType } from '../../../models/ChartType';

describe('ChartPanelComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ChartPane
        chartType={ChartType.ManufactureShare}
        onChangeChartType={() => {}}
        onChangeScale={() => {}}
        scale={1}
      />,
    );
    expect(baseElement).toBeTruthy();
  });
});
