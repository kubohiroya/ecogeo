import { render } from '@testing-library/react';

import GraphPanel from './GraphPanel';

describe('GraphPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <GraphPanel hideGraphEditButtons={true} disableGraphEditButtons={true} />
    );
    expect(baseElement).toBeTruthy();
  });
});
