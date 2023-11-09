import { render } from '@testing-library/react';

import DiagonalMatrixSetPanel from './DiagonalMatrixSetPanel';

describe('MatricesPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagonalMatrixSetPanel
        adjacencyData={[]}
        distanceData={[]}
        transportationCostData={[]}
        maxRowColLength={0}
        rgb={{ r: 1, g: 1, b: 1 }}
        onSelected={() => {}}
        onFocus={() => {}}
        onUnfocus={() => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
