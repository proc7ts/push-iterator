import { beforeEach, describe, expect, it } from '@jest/globals';
import { iteratorOf, pushIterated } from '../base';
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

    describe('iterator', () => {
      it('converts elements', () => {

        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect([...it]).toEqual(['11!', '22!', '33!']);
        expect(it[Symbol.iterator]()).toBe(it);
      });
      it('pushes converted elements', () => {

        const result: string[] = [];
        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect(pushIterated(it, element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt(new Set([11, 22, 33]), element => `${element}!`)[Symbol.iterator]();

        expect(pushIterated(it, () => true)).toBe(true);
        expect(it.isOver()).toBe(false);

        expect(pushIterated(it, element => {
          result.push(element);
        })).toBe(false);
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
    });

    describe('iterator', () => {
      it('pushes converted elements', () => {

        const result: string[] = [];
        const it = mapIt(overMany(11, 22, 33), element => `${element}!`)[Symbol.iterator]();

        expect(pushIterated(it, element => {
          result.push(element);
        })).toBe(false);
        expect(result).toEqual(['11!', '22!', '33!']);
      });
      it('resumes conversion', () => {

        const result: string[] = [];
        const it = mapIt(overMany(11, 22, 33), element => `${element}!`)[Symbol.iterator]();

        expect(pushIterated(it, () => true)).toBe(true);
        expect(it.isOver()).toBe(false);

        expect(pushIterated(it, element => {
          result.push(element);
        })).toBe(false);
        expect(it.isOver()).toBe(true);
        expect(result).toEqual(['22!', '33!']);
      });
      it('aborts conversion', () => {

        const result: string[] = [];
        const it = mapIt(overMany(11, 22, 33), element => `${element}!`)[Symbol.iterator]();

        expect(pushIterated(it, el => {
          result.push(el);
          return false;
        })).toBe(false);
        expect(it.isOver()).toBe(true);
        expect(result).toEqual(['11!']);
      });
    });
  });
});
