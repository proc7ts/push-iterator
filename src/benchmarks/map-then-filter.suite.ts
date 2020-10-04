import { nextSkip } from '@proc7ts/call-thru';
import type Benchmark from 'benchmark';
import { thruIt } from '../call-thru';
import { overArray } from '../construction';
import { itsEach } from '../consumption';
import { filterIt, mapArray, mapIt } from '../transformation';
import { benchArray, benchInput, benchIterable, benchOut } from './bench-data';
import { benchFilter, FilterBenchFactory, filterIterable, generatorFilter } from './filter.suite';
import { generatorMap, mapIterable } from './map.suite';

export function arrayMapThenFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory()
      .add(
          'for ... of [...].map(...).filter(...)',
          () => {
            for (const element of benchInput.map(el => el + '!').filter(el => benchFilter(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of *generatorFilter(*generatorMap([...]))',
          () => {
            for (const element of generatorFilter(
                generatorMap(benchInput, el => el + '!'),
                el => benchFilter(el),
            )) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of filterIterable(mapIterable([...]))',
          () => {
            for (const element of filterIterable(
                mapIterable(benchInput, el => el + '!'),
                el => benchFilter(el),
            )) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(filterIt(mapIt([...])))',
          () => {
            itsEach(
                filterIt(
                    mapIt(benchInput, el => el + '!'),
                    el => benchFilter(el),
                ),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(filterIt(mapArray([...])))',
          () => {
            itsEach(
                filterIt(
                    mapArray(benchInput, el => el + '!'),
                    el => benchFilter(el),
                ),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(thruIt([...]))',
          () => {
            itsEach(
                thruIt(
                    benchInput,
                    el => {

                      const converted = el + '!';

                      return benchFilter(converted) ? converted : nextSkip;
                    },
                ),
                element => benchOut(element),
            );
          },
      )
      .suites('Array map then filter', inputSizes.map(inputSize => [inputSize, rate, outOf]));
}

export function iterableMapThenFilterSuite(
    rate: number,
    outOf: number,
    inputSizes: readonly number[],
): readonly Benchmark.Suite[] {
  return new FilterBenchFactory()
      .add(
          'for ... of buildArray().map(...).filter(...)',
          () => {
            for (const element of benchArray().map(el => el + '!').filter(el => benchFilter(el))) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of *generatorFilter(*generatorMap(iterable))',
          () => {
            for (const element of generatorFilter(
                generatorMap(benchIterable(), el => el + '!'),
                el => benchFilter(el),
            )) {
              benchOut(element);
            }
          },
      )
      .add(
          'for ... of filterIterable(mapIterable(iterable))',
          () => {
            for (const element of filterIterable(
                mapIterable(benchIterable(), el => el + '!'),
                el => benchFilter(el),
            )) {
              benchOut(element);
            }
          },
      )
      .add(
          'itsEach(filterIt(mapIt(overArray([...]))))',
          () => {
            itsEach(
                filterIt(
                    mapIt(overArray(benchInput), (el: string) => el + '!'),
                    el => benchFilter(el),
                ),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(filterIt(mapIt(iterable)))',
          () => {
            itsEach(
                filterIt(
                    mapIt(benchIterable(), el => el + '!'),
                    el => benchFilter(el),
                ),
                element => benchOut(element),
            );
          },
      )
      .add(
          'itsEach(thruIt(iterable))',
          () => {
            itsEach(
                thruIt(
                    benchIterable(),
                    el => {

                      const converted = el + '!';

                      return benchFilter(converted) ? converted : nextSkip;
                    },
                ),
                element => benchOut(element),
            );
          },
      )
      .suites('Iterable map then filter', inputSizes.map(inputSize => [inputSize, rate, outOf]));
}
