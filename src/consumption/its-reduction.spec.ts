import { overArray } from '../construction';
import { itsReduction } from './its-reduction';

describe('itsReduction', () => {
  it('reduces iterable', () => {
    expect(itsReduction([11, 22, 33], (prev, element) => prev + element, 1)).toBe(67);
  });
  it('reduces push iterable', () => {
    expect(itsReduction(overArray([11, 22, 33]), (prev, element) => prev + element, 1)).toBe(67);
  });
  it('returns initial value on empty iterable', () => {
    expect(itsReduction<number, number>([], (prev, element) => prev + element, 1)).toBe(1);
  });
});
