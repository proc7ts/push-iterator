import { PushIterator__symbol } from '../push-iterator';
import { overOne } from './over-one';

describe('overOne', () => {
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

  describe('[Symbol.iterator]', () => {
    it('iterates over single value', () => {
      expect([...overOne('one')]).toEqual(['one']);
    });
    describe('PushIterator__symbol]', () => {
      it('returns iterator itself', () => {

        const it = overOne('one')[Symbol.iterator]();

        expect(it[PushIterator__symbol]()).toBe(it);
      });
    });
  });

  describe('[PushIterator__symbol]', () => {
    it('iterates over single value', () => {
      expect([...overOne('one')[PushIterator__symbol]()]).toEqual(['one']);
    });
  });

});
