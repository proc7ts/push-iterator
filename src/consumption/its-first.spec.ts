import { overArray, overNone } from '../construction';
import { itsFirst } from './its-first';

describe('itsFirst', () => {
  it('returns first array element', () => {
    expect(itsFirst([1, 2, 3])).toBe(1);
  });
  it('returns `undefined` for empty array', () => {
    expect(itsFirst([])).toBeUndefined();
  });
  it('returns first push iterable element', () => {
    expect(itsFirst(overArray([1, 2, 3]))).toBe(1);
  });
  it('returns `undefined` for empty push iterable', () => {
    expect(itsFirst(overNone())).toBeUndefined();
  });
});
