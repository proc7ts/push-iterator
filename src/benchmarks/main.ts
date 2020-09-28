import type Benchmark from 'benchmark';
import { arrayFilterSuite, iterableFilterSuite } from './filter.suite';
import { arrayIterationSuite, iterableIterationSuite } from './iteration.suite';

const PRECISION = 3;
const INPUT_SIZES = [10, 100, 1000];

run().catch((event: any) => {
  console.error('ERROR', event.target.name, event.target.error);
});

async function run(): Promise<void> {
  await runSuites(arrayIterationSuite(INPUT_SIZES));
  await runSuites(iterableIterationSuite(INPUT_SIZES));

  await runSuites(arrayFilterSuite(1, 2, INPUT_SIZES));
  await runSuites(arrayFilterSuite(1, 10, INPUT_SIZES));
  await runSuites(arrayFilterSuite(9, 10, INPUT_SIZES));

  await runSuites(iterableFilterSuite(1, 2, INPUT_SIZES));
  await runSuites(iterableFilterSuite(1, 10, INPUT_SIZES));
  await runSuites(iterableFilterSuite(9, 10, INPUT_SIZES));
}

function runSuites(suites: readonly Benchmark.Suite[]): Promise<unknown> {
  return Promise.all(suites.map(runSuite));
}

function runSuite(suite: Benchmark.Suite): Promise<void> {
  return new Promise<void>((resolve, reject) => {

    const results: any[] = [];

    const options: Benchmark.Options = {
      initCount: 15,
    };

    suite.on('start', ({ currentTarget: { name } }: any) => console.log(`\n${name}`));
    suite.on(
        'cycle',
        ({ target: { name, hz, stats = {} as Benchmark.Stats } }: Benchmark.Event) => results.push({
          name,
          Hz: hz,
          MoE: `±${Number(stats.rme).toFixed(2)}%`,
          '# sampled': stats.sample.length,
        }),
    );
    suite.on('complete', function (this: any) {

      const highestHz = results.slice().sort((a, b) => b.Hz - a.Hz)[0].Hz;

      console.table(
          results
              .sort((a, b) => b.Hz - a.Hz)
              .map(result => ({
                ...result,
                Hz: Math.round(result.Hz).toLocaleString(),
                'x slower': Math.round((10 ** PRECISION * highestHz) / result.Hz) / 10 ** PRECISION,
              }))
              .sort((a, b) => a.INPUT_SIZE - b.INPUT_SIZE)
              .reduce((acc, { name, ...cur }) => ({ ...acc, [name]: cur }), {}),
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
