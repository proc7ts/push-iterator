import type Benchmark from 'benchmark';
import { overArray } from '../construction';
import { itsElements } from '../consumption';
import { benchArray, benchInput, benchIterable, benchOut } from './bench-data';
import { BenchFactory } from './bench-factory';

export function elementsSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of Array.from(iterable)',
          () => {
            for (const element of Array.from(benchIterable(), el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of [...iterable].map(...)',
          () => {
            for (const element of [...benchIterable()].map(el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of buildArray().map(...)',
          () => {
            for (const element of benchArray().map(el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of itsElements(overArray([...]))',
          () => {
            for (const element of itsElements(overArray(benchInput), el => el + '!')) {
              benchOut(element);
            }
          },
      )
      .suites('Elements array', inputSizes.map(inputSize => [inputSize]));
}
