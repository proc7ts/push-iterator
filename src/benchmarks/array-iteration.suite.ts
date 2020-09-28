import type Benchmark from 'benchmark';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { itsIterator } from '../push-iterator';
import type { BenchContext } from './bench-context';
import { BenchFactory } from './bench-factory';

export function arrayIterationSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of [...]',
          function (this: BenchContext) {
            for (const element of this.data.input) {
              this.data.report(element);
            }
          },
      )
      .add(
          '[...].forEach(...)',
          function (this: BenchContext) {
            this.data.input.forEach(element => {
              this.data.report(element);
            });
          },
      )
      .add(
          'itsEach([...])',
          function (this: BenchContext) {
            itsEach(this.data.input, element => this.data.report(element));
          },
      )
      .add(
          'itsEach(overArray([...]))',
          function (this: BenchContext) {
            itsEach(overArray(this.data.input), element => this.data.report(element));
          },
      )
      .add(
          'for ... of overArray([...])',
          function (this: BenchContext) {
            for (const element of overArray(this.data.input)) {
              this.data.report(element);
            }
          },
      )
      .add(
          'for ... of itsIterator([...])',
          function (this: BenchContext) {
            for (const element of itsIterator(this.data.input)) {
              this.data.report(element);
            }
          },
      )
      .suites('Array iteration', inputSizes);
}
