import type Benchmark from 'benchmark';
import { elementsSuite } from './elements.suite';
import { arrayFilterSuite, iterableFilterSuite } from './filter.suite';
import { arrayFlatMapSuite, iterableFlatMapSuite } from './flat-map.suite';
import { arrayIterationSuite, iterableIterationSuite } from './iteration.suite';
import { arrayMapThenFilterSuite, iterableMapThenFilterSuite } from './map-then-filter.suite';
import { arrayMapSuite, iterableMapSuite } from './map.suite';

const PRECISION = 3;
const INPUT_SIZES = [10, 100, 1000];

run().catch((event: Benchmark.Event & { target: { error?: unknown } }) => {
  console.error('ERROR', event.target.name, event.target.error);
});

async function run(): Promise<void> {

  await runSuites(arrayIterationSuite(INPUT_SIZES));
  await runSuites(iterableIterationSuite(INPUT_SIZES));

  await runSuites(elementsSuite(INPUT_SIZES));

  await runSuites(arrayFilterSuite(1, 2, INPUT_SIZES));
  await runSuites(arrayFilterSuite(1, 10, INPUT_SIZES));
  await runSuites(arrayFilterSuite(9, 10, INPUT_SIZES));

  await runSuites(iterableFilterSuite(1, 2, INPUT_SIZES));
  await runSuites(iterableFilterSuite(1, 10, INPUT_SIZES));
  await runSuites(iterableFilterSuite(9, 10, INPUT_SIZES));

  await runSuites(arrayMapSuite(INPUT_SIZES));
  await runSuites(iterableMapSuite(INPUT_SIZES));

  await runSuites(arrayMapThenFilterSuite(1, 2, INPUT_SIZES));
  await runSuites(arrayMapThenFilterSuite(1, 10, INPUT_SIZES));
  await runSuites(arrayMapThenFilterSuite(9, 10, INPUT_SIZES));

  await runSuites(iterableMapThenFilterSuite(1, 2, INPUT_SIZES));
  await runSuites(iterableMapThenFilterSuite(1, 10, INPUT_SIZES));
  await runSuites(iterableMapThenFilterSuite(9, 10, INPUT_SIZES));

  await runSuites(arrayFlatMapSuite(1, INPUT_SIZES));
  await runSuites(arrayFlatMapSuite(4, INPUT_SIZES));
  await runSuites(arrayFlatMapSuite(32, INPUT_SIZES));

  await runSuites(iterableFlatMapSuite(1, INPUT_SIZES));
  await runSuites(iterableFlatMapSuite(4, INPUT_SIZES));
  await runSuites(iterableFlatMapSuite(32, INPUT_SIZES));

}

function runSuites(suites: readonly Benchmark.Suite[]): Promise<unknown> {
  return Promise.all(suites.map(runSuite));
}

function runSuite(suite: Benchmark.Suite): Promise<void> {
  return new Promise<void>((resolve, reject) => {

    const results: Result[] = [];

    const options: Benchmark.Options = {
      initCount: 15,
      async: false,
    };

    suite.on('start', ({ currentTarget: { name } }: any) => console.log(`\n${name}`));
    suite.on(
        'cycle',
        ({ target: { name, hz, stats = {} as Benchmark.Stats } }: Benchmark.Event) => results.push({
          name,
          Hz: hz!,
          MoE: `±${Number(stats.rme).toFixed(2)}%`,
          '# sampled': stats.sample.length,
        }),
    );
    suite.on('complete', function (this: Benchmark.Suite) {

      results.sort((a, b) => b.Hz - a.Hz);

      const highestHz = results[0].Hz;

      console.table(
          results
              .map(result => ({
                ...result,
                Hz: Math.round(result.Hz).toLocaleString(),
                'x slower': Math.round((10 ** PRECISION * highestHz) / result.Hz) / 10 ** PRECISION,
              }))
              .sort((a, b) => a.INPUT_SIZE! - b.INPUT_SIZE!)
              .reduce<AccResult>((acc, { name, ...cur }) => ({ ...acc, [name!]: cur }), {}),
      );

      console.log('Fastest is', this.filter('fastest').map('name'));
      resolve();
    });
    suite.on('error', (error: Benchmark.Event) => {
      reject(error);
    });

    suite.run(options);
  });
}

interface Result {
  name?: string | undefined;
  Hz: number;
  MoE: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '# sampled': number;
  INPUT_SIZE?: number | undefined;
}

interface AccResult {
  [name: string]: {
    Hz: string;
    MoE: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '# sampled': number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'x slower': number;
  };
}
