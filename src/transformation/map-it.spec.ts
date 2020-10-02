import { overMany } from '../construction';
import { PushIterator__symbol } from '../push-iterator';
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
        expect(it[PushIterator__symbol]()).toBe(it);
      });
    });

    describe('forEach', () => {
      it('reports converted elements', () => {

        const result: string[] = [];

        expect(mapIt(new Set([11, 22, 33]), element => `${element}!`)[PushIterator__symbol]().forNext(element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[PushIterator__symbol]();

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
});
