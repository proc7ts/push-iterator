import { beforeEach, describe, expect, it } from '@jest/globals';
import { iteratorOf, makePushIterator } from '../base';
import { iterateIt } from '../base/iterate-it';
import { overMany } from '../construction';
import { itsEach } from '../consumption';
import { PushIterationMode } from '../push-iteration-mode';
import { flatMapIt } from './flat-map-it';

describe('flatMapIt', () => {
  describe('over raw iterable', () => {
    it('maps and flattens array elements', () => {

      const it = flatMapIt(new Set([11, 22, 33]), element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens raw iterable elements', () => {

      const it = flatMapIt(new Set([11, 22, 33]), element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens push iterable elements', () => {

      const it = flatMapIt(new Set([11, 22, 33]), element => overMany(element, element + 1));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('flattens elements', () => {

      const it = flatMapIt<number>(new Set([[11, 12], [13, 14]]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
    it('allows to select flattened elements', () => {

      const it = flatMapIt<number>(new Set([[11, 12], [13, 14]]));
      const result: number[] = [];

      iterateIt(
          it,
          el => {
            result.push(el);

            return result.length > 2 ? false : void 0;
          },
          PushIterationMode.Only,
      );

      expect(result).toEqual([11, 12, 13]);
    });
  });

  describe('over raw iterator with push iterable', () => {

    let iterable: Iterable<number>;

    beforeEach(() => {

      const src = overMany(11, 22, 33);

      iterable = { [Symbol.iterator]: () => iteratorOf(src) };
    });

    it('maps and flattens array elements', () => {

      const it = flatMapIt(iterable, element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens raw iterable elements', () => {

      const it = flatMapIt(iterable, element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
  });

  describe('over push iterable', () => {
    it('maps and flattens array elements', () => {

      const it = flatMapIt(overMany(11, 22, 33), element => [element, element + 1]);
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens raw iterable elements', () => {

      const it = flatMapIt(overMany(11, 22, 33), element => new Set([element, element + 1]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('maps and flattens push iterable elements', () => {

      const it = flatMapIt(overMany(11, 22, 33), element => overMany(element, element + 1));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 22, 23, 33, 34]);
      expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
    });
    it('flattens elements', () => {

      const it = flatMapIt<number>(overMany([11, 12], [13, 14]));
      const result: number[] = [];

      itsEach(it, el => result.push(el));
      expect(result).toEqual([11, 12, 13, 14]);
      expect([...it]).toEqual([11, 12, 13, 14]);
    });
    it('allows to select flattened elements', () => {

      const it = flatMapIt<number>(overMany([11, 12], [13, 14]));
      const result: number[] = [];

      iterateIt(
          it,
          el => {
            result.push(el);

            return result.length > 2 ? false : void 0;
          },
          PushIterationMode.Only,
      );

      expect(result).toEqual([11, 12, 13]);
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

      expect([...flatMapIt(it, el => [el, el])]).toEqual(['test', 'test']);
    });
  });
});
