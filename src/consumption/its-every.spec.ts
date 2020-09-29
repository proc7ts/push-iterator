import { itsEvery } from './its-every';

describe('itsEvery', () => {
  it('return `true` for empty iterable', () => {
    expect(itsEvery([], () => false)).toBe(true);
  });
  it('return `true` if all elements match', () => {
    expect(itsEvery([1, 2, 3], () => true)).toBe(true);
  });
  it('return `true` if tests return truthy value', () => {
    expect(itsEvery([1, 2, 3], el => el as unknown as boolean)).toBe(true);
  });
  it('return `false` if some element does not match', () => {

    const test = jest.fn(element => element < 2);

    expect(itsEvery([1, 2, 3], test)).toBe(false);
    expect(test).toHaveBeenCalledWith(1);
    expect(test).toHaveBeenCalledWith(2);
    expect(test).not.toHaveBeenCalledWith(3);
  });
});
