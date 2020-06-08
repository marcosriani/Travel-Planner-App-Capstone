import { handleSubmit } from '../src/client/js/formHandler';

describe('Filter function', () => {
  test('It should return true', () => {
    expect(handleSubmit).toBeDefined();
  });
});
