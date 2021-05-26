import { describe, expect, it } from '@jest/globals';
import { iteratorOf, pushIterated } from '../base';
import { itsElements } from '../consumption';
import { mapArray } from './map-array';

describe('mapArray', () => {
  it('converts elements', () => {
    expect([...mapArray([11, 22, 33], element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
  });
  it('pushes converted elements', () => {
    expect(itsElements(mapArray([11, 22, 33], element => `${element}!`))).toEqual(['11!', '22!', '33!']);
  });

  describe('iterator', () => {
    it('converts elements', () => {

      const it = mapArray([11, 22, 33], element => `${element}!`)[Symbol.iterator]();

      expect([...it]).toEqual(['11!', '22!', '33!']);
      expect(it[Symbol.iterator]()).toBe(it);
    });
    it('pushes converted elements', () => {

      const result: string[] = [];
      const it = mapArray([11, 22, 33], element => `${element}!`)[Symbol.iterator]();

      expect(pushIterated(it, element => {
        result.push(element);
      })).toBe(false);
      expect(result).toEqual(['11!', '22!', '33!']);
    });
    it('resumes conversion', () => {

      const result: string[] = [];
      const it = mapArray([11, 22, 33], element => `${element}!`)[Symbol.iterator]();

      expect(pushIterated(it, () => true)).toBe(true);
      expect(it.isOver()).toBe(false);

      expect(pushIterated(it, element => {
        result.push(element);
      })).toBe(false);
      expect(it.isOver()).toBe(true);
      expect(result).toEqual(['22!', '33!']);

      expect(pushIterated(it, element => {
        result.push(element);
      })).toBe(false);
      expect(result).toEqual(['22!', '33!']);
      expect([...it]).toHaveLength(0);
    });
  });

  describe('over empty array', () => {
    it('does not iterate', () => {

      const it = iteratorOf(mapArray<number, number>([], n => n + 1));

      expect(it.isOver()).toBe(false);

      expect([...it]).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
    it('does not push elements', () => {

      const it = iteratorOf(mapArray<number, number>([], n => n + 1));

      expect(it.isOver()).toBe(false);

      expect(itsElements(it)).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
  });
});
