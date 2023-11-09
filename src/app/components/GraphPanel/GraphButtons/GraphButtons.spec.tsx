import { render } from '@testing-library/react';

import GraphButtons from './GraphButtons';

describe('GraphEditButtons', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GraphButtons disabled show />);
    expect(baseElement).toBeTruthy();
  });
});
