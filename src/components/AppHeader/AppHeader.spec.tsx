import { render } from '@testing-library/react';

import AppHeader from './AppHeader';

describe('AppHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppHeader>a</AppHeader>);
    expect(baseElement).toBeTruthy();
  });
});
