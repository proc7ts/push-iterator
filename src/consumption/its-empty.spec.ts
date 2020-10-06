import { overNone } from '../construction';
import { itsEmpty } from './its-empty';
import { itsIterator } from './its-iterator';

describe('itsEmpty', () => {
  it('returns `true` for empty array', () => {
    expect(itsEmpty([])).toBe(true);
  });
  it('returns `false` for non-empty array', () => {
    expect(itsEmpty([1])).toBe(false);
  });
  it('returns `true` for empty iterable', () => {
    expect(itsEmpty({
      [Symbol.iterator]: () => ({
        next: () => ({ done: true, value: 'ok' }),
      }),
    })).toBe(true);
  });
  it('returns `false` for non-empty iterable', () => {
    expect(itsEmpty([1].values())).toBe(false);
  });
  it('returns `true` for empty push iterable', () => {
    expect(itsEmpty(overNone())).toBe(true);
  });
  it('returns `false` for non-empty push iterable', () => {
    expect(itsEmpty(itsIterator([1]))).toBe(false);
  });
});
