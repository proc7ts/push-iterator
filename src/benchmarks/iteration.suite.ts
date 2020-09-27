import type Benchmark from 'benchmark';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { itsIterator } from '../push-iterator';
import { BenchFactory } from './bench-factory';

export function iterationSuites(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of [...]',
          data => {
            for (const element of data.input) {
              data.report(element);
            }
          },
      )
      .add(
          '[...].forEach(...)',
          data => {
            data.input.forEach(element => {
              data.report(element);
            });
          },
      )
      .add(
          'for ... of *generator()',
          data => {
            for (const element of data.generator()) {
              data.report(element);
            }
          },
      )
      .add(
          'for ... of iterable()',
          data => {
            for (const element of data.iterable()) {
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
          'for ... of overArray([...])',
          data => {
            for (const element of overArray(data.input)) {
              data.report(element);
            }
          },
      )
      .add(
          'for ... of itsIterator([...])',
          data => {
            for (const element of itsIterator(data.input)) {
              data.report(element);
            }
          },
      )
      .suites('Iteration', inputSizes);
}
