import type Benchmark from 'benchmark';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { BenchFactory } from './bench-factory';

export function iterationSuites(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... in [...]',
          data => {
            for (const element of data.input) {
              data.report(element);
            }
          },
      )
      .add(
          'for ... in *generator()',
          data => {
            for (const element of data.values()) {
              data.report(element);
            }
          },
      )
      .add(
          'itsEach([...])',
          data => {
            itsEach(data.input, element => data.report(element));
          },
      )
      .add(
          'itsEach(overArray([...]))',
          data => {
            itsEach(overArray(data.input), element => data.report(element));
          },
      )
      .add(
          'for ... in overArray([...])',
          data => {
            itsEach(overArray(data.input), element => data.report(element));
          },
      )
      .add(
          'for ... in itsIterator([...])',
          data => {
            itsEach(overArray(data.input), element => data.report(element));
          },
      )
      .suites('Iteration', inputSizes);
}
