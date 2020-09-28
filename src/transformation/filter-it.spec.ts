import { overNone } from '../construction';
import { itsIterator } from '../push-iterator';
import { filterIt } from './filter-it';

describe('filterIt', () => {
  it('filters elements', () => {
    expect([...filterIt(new Set([11, 22, 33]), element => element > 11)]).toEqual([22, 33]);
  });
  it('resumes filtering', () => {

    const it = itsIterator(filterIt(new Set([11, 22, 33]), element => element > 11));

    it.forNext(() => false);

    expect([...it]).toEqual([33]);
  });
  it('does not filter empty iterable', () => {
    expect([...filterIt(overNone(), () => true)]).toEqual([]);
  });
});
