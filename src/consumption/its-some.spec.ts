import { itsSome } from './its-some';

describe('itsSome', () => {
  it('returns `false` for empty iterable', () => {
    expect(itsSome([], () => true)).toBe(false);
  });
  it('returns `false` if all elements mismatch', () => {
    expect(itsSome([1, 2, 3], () => false)).toBe(false);
  });
  it('returns `true` if some element matches', () => {

    const test = jest.fn(element => element > 1);

    expect(itsSome([1, 2, 3], test)).toBe(true);
    expect(test).toHaveBeenCalledWith(1);
    expect(test).toHaveBeenCalledWith(2);
    expect(test).not.toHaveBeenCalledWith(3);
  });
});
