import { render } from '@testing-library/react';

import ReferenceSection from 'src/app/components/ReferenceSection/ReferenceSection';

describe('RefSection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReferenceSection />);
    expect(baseElement).toBeTruthy();
  });
});
