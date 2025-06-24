import { demoCore } from '@hyperse/wizard-core';

describe('DEMO', () => {
  it('should render', () => {
    const result = demoCore();
    expect(result).toBe('demoCore');
  });
});
