import { overArray } from '../construction';
import { itsEach } from './its-each';

describe('itsEach', () => {
  it('iterates over each iterable element', () => {

    const array = ['foo', 'bar', 'baz'];
    const result: string[] = [];

    itsEach(
        new Set(array),
        element => {
          result.push(element);
          return false; // To ensure the result is ignored
        },
    );

    expect(result).toEqual(array);
  });
  it('iterates over each push iterable element', () => {

    const array = ['foo', 'bar', 'baz'];
    const result: string[] = [];

    itsEach(
        overArray(array),
        element => {
          result.push(element);
          return false; // To ensure the result is ignored
        },
    );

    expect(result).toEqual(array);
  });
});
