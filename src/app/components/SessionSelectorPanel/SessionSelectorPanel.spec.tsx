import { render } from '@testing-library/react';

import SessionSelectorPanel from './SessionSelectorPanel';

describe('ParamPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SessionSelectorPanel
        value={'0'}
        sessions={[]}
        onChangeCase={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
