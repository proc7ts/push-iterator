import { describe, expect, it } from '@jest/globals';
import { iterateGenerated } from './index';

describe('iterateOver', () => {
  it('ignores excessive pushes', () => {

    const result: number[] = [];

    iterateGenerated<number>(
        push => {
          push(1);
          push(2);
          push(3);
        },
        element => {
          result.push(element);
          return false;
        },
    );

    expect(result).toEqual([1]);
  });
});
