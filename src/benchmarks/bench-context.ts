import type { BenchData } from './bench-data';

export interface BenchContext {
  data: BenchData;
  newData(): BenchData;
  generator(input: Iterable<string>): IterableIterator<string>;
  iterable(input: Iterable<string>): Iterable<string>;
}
