import { render } from '@testing-library/react';

import TimeControlPanel from './TimeControlPanel';

describe('TimeControlPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TimeControlPanel
        started
        speed={0.5}
        timerCounter={0}
        onStart={() => {}}
        onStop={() => {}}
        onReset={() => {}}
        onSpeedChange={() => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
