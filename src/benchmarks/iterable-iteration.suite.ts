import type Benchmark from 'benchmark';
import { itsEach } from '../consumption';
import { itsIterator } from '../push-iterator';
import type { BenchContext } from './bench-context';
import { BenchFactory } from './bench-factory';

export function iterableIterationSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of iterable',
          function (this: BenchContext) {
            for (const element of this.data.iterable()) {
              this.data.report(element);
            }
          },
      )
      .add(
          'itsEach(iterable)',
          function (this: BenchContext) {
            itsEach(this.data.iterable(), element => this.data.report(element));
          },
      )
      .add(
          'for ... of itsIterator(iterable)',
          function (this: BenchContext) {
            for (const element of itsIterator(this.data.iterable())) {
              this.data.report(element);
            }
          },
      )
      .suites('Iterable iteration', inputSizes);
}
