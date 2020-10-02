import { PushIterator__symbol } from '../push-iterator';
import { overNone } from './over-none';

describe('overNone', () => {
  describe('forNext', () => {
    it('does not iterate', () => {

      let iterated = false;

      expect(overNone().forNext(() => {
        iterated = true;
      })).toBe(false);
      expect(iterated).toBe(false);
    });
  });

  describe('[Symbol.iterator]', () => {
    it('does not iterate', () => {
      expect([...overNone()]).toHaveLength(0);
    });
  });

  describe('[PushIterator__symbol]', () => {
    it('does not iterate', () => {
      expect([...overNone()[PushIterator__symbol]()]).toHaveLength(0);
    });
  });
});
