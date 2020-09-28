import { overArray } from '../construction';
import { flatMapIt } from './flat-map-it';

describe('flatMapIt', () => {
  it('maps and flattens iterable', () => {

    const elements = new Set([11, 22, 33]);

    expect([...flatMapIt(elements, element => [element, element + 1])]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens push iterable', () => {

    const elements = overArray([11, 22, 33]);

    expect([...flatMapIt(elements, element => [element, element + 1])]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens iterable elements', () => {

    const elements = new Set([11, 22, 33]);

    expect([...flatMapIt(elements, element => new Set([element, element + 1]))]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens push iterable elements', () => {

    const elements = new Set([11, 22, 33]);

    expect([...flatMapIt(elements, element => overArray([element, element + 1]))]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('flattens iterable elements without converter specified', () => {
    expect([...flatMapIt(new Set([[11, 12], [13, 14]]))]).toEqual([11, 12, 13, 14]);
  });
  it('flattens push iterable elements without converter specified', () => {
    expect([...flatMapIt(overArray([[11, 12], [13, 14]]))]).toEqual([11, 12, 13, 14]);
  });
});
