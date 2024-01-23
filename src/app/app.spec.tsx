import { render } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App type={'real-world'} />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<App type={'real-world'} />);
    expect(getByText(/Welcome geoeco/gi)).toBeTruthy();
  });
});
