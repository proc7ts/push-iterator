import { overMany, overNone } from '../construction';
import { makePushIterator } from '../make-push-iterator';
import { mapIt } from './map-it';

describe('mapIt', () => {
  describe('over raw iterable', () => {
    it('converts elements', () => {
      expect([...mapIt(new Set([11, 22, 33]), element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
    });

    describe('[Symbol.iterator]', () => {
      it('converts elements', () => {

        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect([...it]).toEqual(['11!', '22!', '33!']);
        expect(it[Symbol.iterator]()).toBe(it);
      });
    });

    describe('forNext', () => {
      it('reports converted elements', () => {

        const result: string[] = [];

        expect(mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]().forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect(it.forNext(() => false)).toBe(true);
        expect(it.forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['22!', '33!']);
      });
    });
  });

  describe('over push iterable', () => {
    it('converts elements', () => {
      expect([...mapIt(overMany(11, 22, 33), element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
    });

    describe('forNext', () => {
      it('reports converted elements', () => {

        const result: string[] = [];

        expect(mapIt(overMany(11, 22, 33), element => `${element}!`)[Symbol.iterator]().forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt(overMany(11, 22, 33), element => `${element}!`)[Symbol.iterator]();

        expect(it.forNext(() => false)).toBe(true);
        expect(it.forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['22!', '33!']);
      });
      it('handles non-pushing iterations', () => {

        let i = 0;
        const it = makePushIterator<string>(accept => {
          ++i;
          switch (i) {
          case 1:
          case 2:
          case 4:
            return true;
          case 3:
            accept('test');
            return true;
          default:
            return false;
          }
        });

        expect([...mapIt(it, element => `${element}!`)]).toEqual(['test!']);
      });
    });
  });

  describe('over array', () => {
    it('converts elements', () => {
      expect([...mapIt([11, 22, 33], element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
    });

    describe('[Symbol.iterator]', () => {
      it('converts elements', () => {

        const it = mapIt([11, 22, 33], element => `${element}!`)[Symbol.iterator]();

        expect([...it]).toEqual(['11!', '22!', '33!']);
        expect(it[Symbol.iterator]()).toBe(it);
      });
    });

    describe('forNext', () => {
      it('reports converted elements', () => {

        const result: string[] = [];

        expect(mapIt([11, 22, 33], element => `${element}!`)[Symbol.iterator]().forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt([11, 22, 33], element => `${element}!`)[Symbol.iterator]();

        expect(it.forNext(() => false)).toBe(true);
        expect(it.forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['22!', '33!']);

        expect(it.forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['22!', '33!']);
        expect([...it]).toHaveLength(0);
      });
    });
  });

  describe('over empty array', () => {
    it('returns `overNone()`', () => {
      expect(mapIt([], () => 'wrong')).toBe(overNone());
    });
  });

  describe('over one-element array', () => {
    it('iterates over single element', () => {
      expect([...mapIt(['one'], el => el + '!')]).toEqual(['one!']);
    });
  });
});
