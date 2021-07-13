import { describe, expect, it } from '@jest/globals';
import { iterateOver } from './index';

describe('iterateOver', () => {
  it('ignores excessive pushes', () => {

    const result: number[] = [];

    iterateOver<number, number>(
        (push, _state) => {
          push(1);
          push(2);
          push(3);
        },
        element => {
          result.push(element);
        },
    );

    expect(result).toEqual([1]);
  });
});
