import { overMany, overNone } from '../construction';
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
