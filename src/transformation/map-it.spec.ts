import { beforeEach, describe, expect, it } from '@jest/globals';
import { iteratorOf, makePushIterator } from '../base';
import { iterateIt } from '../base/iterate-it';
import { overMany } from '../construction';
import { itsElements } from '../consumption';
import { mapIt } from './map-it';

describe('mapIt', () => {
  describe('over raw iterable', () => {
    it('converts elements', () => {
      expect([...mapIt(new Set([11, 22, 33]), element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
    });
    it('pushes converted elements', () => {
      expect(itsElements(mapIt(new Set([11, 22, 33]), element => `${element}!`))).toEqual(['11!', '22!', '33!']);
    });
    it('does not convert absent elements', () => {

      const result: string[] = [];

      expect(iterateIt(
          mapIt(new Set<string>(), element => `${element}!`),
          el => result.push(el),
      ).isOver()).toBe(true);
      expect(result).toHaveLength(0);
    });

    describe('iterator', () => {
      it('converts elements', () => {

        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect([...it]).toEqual(['11!', '22!', '33!']);
        expect(it[Symbol.iterator]()).toBe(it);
      });
      it('pushes converted elements', () => {

        const result: string[] = [];
        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect(iterateIt(it, element => {
          result.push(element);
        }).isOver()).toBe(true);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect(iterateIt(it, () => true).isOver()).toBe(false);
        expect(it.isOver()).toBe(false);

        expect(iterateIt(it, element => {
          result.push(element);
        }).isOver()).toBe(true);
        expect(it.isOver()).toBe(true);
        expect(result).toEqual(['22!', '33!']);
      });
    });
  });

  describe('over raw iterator with push iterable', () => {

    let iterable: Iterable<number>;

    beforeEach(() => {

      const src = overMany(11, 22, 33);

      iterable = { [Symbol.iterator]: () => iteratorOf(src) };
    });

    it('converts elements', () => {
      expect([...mapIt(iterable, element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
    });
    it('pushes converted elements', () => {
      expect(itsElements(mapIt(iterable, element => `${element}!`))).toEqual(['11!', '22!', '33!']);
    });
  });

  describe('over push iterable', () => {
    it('converts elements', () => {
      expect([...mapIt(overMany(11, 22, 33), element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
      expect(itsElements(mapIt(overMany(11, 22, 33), element => `${element}!`))).toEqual(['11!', '22!', '33!']);
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

    describe('iterator', () => {
      it('pushes converted elements', () => {

        const result: string[] = [];
        const it = mapIt(overMany(11, 22, 33), element => `${element}!`)[Symbol.iterator]();

        expect(iterateIt(it, element => {
          result.push(element);
        }).isOver()).toBe(true);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt(overMany(11, 22, 33), element => `${element}!`)[Symbol.iterator]();

        expect(iterateIt(it, () => true).isOver()).toBe(false);
        expect(it.isOver()).toBe(false);

        expect(iterateIt(it, element => {
          result.push(element);
        }).isOver()).toBe(true);
        expect(it.isOver()).toBe(true);
        expect(result).toEqual(['22!', '33!']);
      });
    });
  });
});
