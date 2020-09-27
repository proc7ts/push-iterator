import type { BenchData } from './bench-data';

export interface BenchContext {
  data: BenchData;
  newData(): BenchData;
}
