import { validatorAndButton } from '../src/client/js/validatorAndButton';

describe('Filter function', () => {
  test('It should be a function', () => {
    expect(typeof validatorAndButton).toBe('function');
  });
});
