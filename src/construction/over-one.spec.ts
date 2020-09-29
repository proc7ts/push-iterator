import { overOne } from './over-one';

describe('overOne', () => {
  describe('[Symbol.iterator]', () => {
    it('iterates over single value', () => {
      expect([...overOne('one')]).toEqual(['one']);
    });
  });
  describe('forNext', () => {
    it('reports single element', () => {

      const result: string[] = [];
      const it = overOne('one')[Symbol.iterator]();

      expect(it.forNext(element => {
        result.push(element);
      })).toBe(false);
      expect([...it]).toHaveLength(0);
      expect(it.forNext(element => {
        result.push(element);
      })).toBe(false);

      expect(result).toEqual(['one']);
    });
  });
});
