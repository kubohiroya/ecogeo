import { render } from '@testing-library/react';

import DiagonalMatrix from './DiagonalMatrix';

describe('Matrix', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagonalMatrix
        tableRef={null}
        title=""
        rgb={{ r: 0, g: 0, b: 0 }}
        data={[[]]}
        id={''}
        maxRowColLength={100}
        onMouseEnter={(ev) => {}}
        onMouseLeave={(ev) => {}}
        onMouseDown={(ev) => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
