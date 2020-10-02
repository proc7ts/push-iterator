import { overNone } from './construction';
import { isPushIterable } from './push-iterable';

describe('isPushIterable', () => {
  it('returns `false` for array', () => {
    expect(isPushIterable([])).toBe(false);
  });
  it('returns `true` for push iterable', () => {
    expect(isPushIterable(overNone())).toBe(true);
  });
});
