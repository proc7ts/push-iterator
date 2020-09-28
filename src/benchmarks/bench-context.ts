import type { BenchData } from './bench-data';

export interface BenchContext<TData extends BenchData = BenchData> {
  data: TData;
  newData(): TData;
}
