import { itsReduction } from './its-reduction';

describe('itsReduction', () => {
  it('reduces value', () => {
    expect(itsReduction([11, 22, 33], (prev, element) => prev + element, 1)).toBe(67);
  });
  it('returns initial value on empty iterable', () => {
    expect(itsReduction<number, number>([], (prev, element) => prev + element, 1)).toBe(1);
  });
});
