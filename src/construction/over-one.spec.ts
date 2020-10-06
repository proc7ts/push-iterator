import { pushIterated } from '../base';
import { overOne } from './over-one';

describe('overOne', () => {
  it('pushes single element', () => {

    const result: string[] = [];
    const it = overOne('one')[Symbol.iterator]();

    expect(pushIterated(it, element => {
      result.push(element);
    })).toBe(false);
    expect([...it]).toHaveLength(0);
    expect(pushIterated(it, element => {
      result.push(element);
    })).toBe(false);

    expect(result).toEqual(['one']);
  });
  it('iterates over single value', () => {
    expect([...overOne('one')]).toEqual(['one']);
  });
});
