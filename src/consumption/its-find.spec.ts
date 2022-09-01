import { describe, expect, it } from '@jest/globals';
import { itsFind } from './its-find';

describe('itsFind', () => {
  it('extracts the found value', () => {
    expect(itsFind([1, 2, 3], el => (el > 1 ? el : false))).toBe(2);
  });
  it('extracts nothing when search returns `false`', () => {
    expect(itsFind([1, 2, 3], () => false)).toBeUndefined();
  });
  it('extracts nothing when search returns `undefined`', () => {
    expect(itsFind([1, 2, 3], () => undefined)).toBeUndefined();
  });
  it('extracts `true` when search returns `true`', () => {
    expect(itsFind([1, 2, 3], el => el > 1)).toBe(true);
  });
});
