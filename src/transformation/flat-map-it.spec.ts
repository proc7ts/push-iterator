import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { flatMapIt } from './flat-map-it';

describe('flatMapIt', () => {
  it('maps and flattens iterable', () => {

    const elements = new Set([11, 22, 33]);
    const it = flatMapIt(elements, element => [element, element + 1]);
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens push iterable', () => {

    const elements = overArray([11, 22, 33]);
    const it = flatMapIt(elements, element => [element, element + 1]);
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens iterable elements', () => {

    const elements = new Set([11, 22, 33]);
    const it = flatMapIt(elements, element => new Set([element, element + 1]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens push iterable elements', () => {

    const elements = new Set([11, 22, 33]);
    const it = flatMapIt(elements, element => overArray([element, element + 1]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 22, 23, 33, 34]);
    expect([...it]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('flattens iterable elements without converter specified', () => {

    const it = flatMapIt<number>(new Set([[11, 12], [13, 14]]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 13, 14]);
    expect([...it]).toEqual([11, 12, 13, 14]);
  });
  it('flattens push iterable elements without converter specified', () => {

    const it = flatMapIt<number>(overArray([[11, 12], [13, 14]]));
    const result: number[] = [];

    itsEach(it, el => result.push(el));
    expect(result).toEqual([11, 12, 13, 14]);
    expect([...it]).toEqual([11, 12, 13, 14]);
  });
});
