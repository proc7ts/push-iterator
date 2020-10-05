import type Benchmark from 'benchmark';
import { itsIterator } from '../base';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { benchArray, benchInput, benchIterable, benchOut } from './bench-data';
import { BenchFactory } from './bench-factory';

export function arrayIterationSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of [...]',
          () => {
            for (const element of benchInput) {
              benchOut(element);
            }
          },
      )
      .add(
          '[...].forEach(...)',
          () => {
            benchInput.forEach(element => {
              benchOut(element);
            });
          },
      )
      .add(
          'itsEach([...])',
          () => {
            itsEach(benchInput, element => benchOut(element));
          },
      )
      .add(
          'for ... of itsIterator([...])',
          () => {
            for (const element of itsIterator(benchInput)) {
              benchOut(element);
            }
          },
      )
      .suites('Array iteration', inputSizes.map(inputSize => [inputSize]));
}

export function iterableIterationSuite(inputSizes: readonly number[]): readonly Benchmark.Suite[] {
  return new BenchFactory()
      .add(
          'for ... of buildArray()',
          () => {
            for (const element of benchArray()) {
              benchOut(element);
            }
          },
      )
      .add(
          'buildArray().forEach(...)',
          () => {
            benchArray().forEach(element => {
              benchOut(element);
            });
          },
      )
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
            itsEach(overArray(benchInput), element => benchOut(element));
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
