import type Benchmark from 'benchmark';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { itsIterator } from '../its-iterator';
import { benchArray, benchIterable, benchOut } from './bench-data';
import { BenchFactory } from './bench-factory';

export function arrayIterationSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of [...]',
          () => {
            for (const element of benchArray) {
              benchOut(element);
            }
          },
      )
      .add(
          '[...].forEach(...)',
          () => {
            benchArray.forEach(element => {
              benchOut(element);
            });
          },
      )
      .add(
          'itsEach([...])',
          () => {
            itsEach(benchArray, element => benchOut(element));
          },
      )
      .add(
          'for ... of itsIterator([...])',
          () => {
            for (const element of itsIterator(benchArray)) {
              benchOut(element);
            }
          },
      )
      .suites('Array iteration', inputSizes.map(inputSize => [inputSize]));
}

export function iterableIterationSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of iterable',
          () => {
            for (const element of benchIterable()) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(iterable)',
          () => {
            itsEach(benchIterable(), element => benchOut(element));
          },
      )
      .add(
          'itsEach(overArray([...]))',
          () => {
            itsEach(overArray(benchArray), element => benchOut(element));
          },
      )
      .add(
          'for ... of itsIterator(iterable)',
          () => {
            for (const element of itsIterator(benchIterable())) {
              benchOut(element);
            }
          },
      )
      .suites('Iterable iteration', inputSizes.map(inputSize => [inputSize]));
}
