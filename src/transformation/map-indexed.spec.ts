import { beforeEach, describe, expect, it } from '@jest/globals';
import { iteratorOf } from '../base';
import { iterateIt } from '../base/iterate-it';
import type { IndexedItemList } from '../construction';
import { itsElements } from '../consumption';
import { mapIndexed } from './map-indexed';

describe('mapIndexed', () => {

  let list: IndexedItemList<number>;

  beforeEach(() => {

    const array = [11, 22, 33];

    list = {
      length: array.length,
      item(index) {
        return array[index];
      },
    };
  });

  it('converts elements', () => {
    expect([...mapIndexed(list, element => `${element}!`)]).toEqual(['11!', '22!', '33!']);
  });
  it('pushes converted elements', () => {
    expect(itsElements(mapIndexed(list, element => `${element}!`))).toEqual(['11!', '22!', '33!']);
  });

  describe('iterator', () => {
    it('converts elements', () => {

      const it = mapIndexed(list, element => `${element}!`)[Symbol.iterator]();

      expect([...it]).toEqual(['11!', '22!', '33!']);
      expect(it[Symbol.iterator]()).toBe(it);
    });
    it('pushes converted elements', () => {

      const result: string[] = [];
      const it = mapIndexed(list, element => `${element}!`)[Symbol.iterator]();

      expect(iterateIt(it, element => {
        result.push(element);
      }).isOver()).toBe(true);
      expect(result).toEqual(['11!', '22!', '33!']);
    });
    it('resumes conversion', () => {

      const result: string[] = [];
      const it = mapIndexed(list, element => `${element}!`)[Symbol.iterator]();

      expect(iterateIt(it, () => true).isOver()).toBe(false);
      expect(it.isOver()).toBe(false);

      expect(iterateIt(it, element => {
        result.push(element);
      }).isOver()).toBe(true);
      expect(it.isOver()).toBe(true);
      expect(result).toEqual(['22!', '33!']);

      expect(iterateIt(it, element => {
        result.push(element);
      }).isOver()).toBe(true);
      expect(result).toEqual(['22!', '33!']);
      expect([...it]).toHaveLength(0);
    });
  });

  describe('over empty list', () => {

    beforeEach(() => {
      list = {
        length: 0,
        item: () => null,
      };
    });

    it('does not iterate', () => {

      const it = iteratorOf(mapIndexed(list, n => n + 1));

      expect(it.isOver()).toBe(false);

      expect([...it]).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
    it('does not push elements', () => {

      const it = iteratorOf(mapIndexed(list, n => n + 1));

      expect(it.isOver()).toBe(false);

      expect(itsElements(it)).toHaveLength(0);
      expect(it.isOver()).toBe(true);
    });
  });
});
