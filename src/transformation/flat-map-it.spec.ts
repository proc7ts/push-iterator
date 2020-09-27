import { overArray } from '../construction';
import { flatMapIt } from './flat-map-it';

describe('flatMapIt', () => {
  it('maps and flattens array elements', () => {

    const elements = [11, 22, 33];

    expect([...flatMapIt(elements, element => [element, element + 1])]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps and flattens iterable elements', () => {

    const elements = overArray([11, 22, 33]);

    expect([...flatMapIt(elements, element => [element, element + 1])]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps to iterables and flattens array elements', () => {

    const elements = [11, 22, 33];

    expect([...flatMapIt(elements, element => overArray([element, element + 1]))]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('maps to iterables and flattens iterable elements', () => {

    const elements = overArray([11, 22, 33]);

    expect([...flatMapIt(elements, element => overArray([element, element + 1]))]).toEqual([11, 12, 22, 23, 33, 34]);
  });
  it('flattens array elements without converter specified', () => {
    expect([...flatMapIt([[11, 12], [13, 14]])]).toEqual([11, 12, 13, 14]);
  });
  it('flattens iterable elements without converter specified', () => {
    expect([...flatMapIt(overArray([[11, 12], [13, 14]]))]).toEqual([11, 12, 13, 14]);
  });
});
