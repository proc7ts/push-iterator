import type Benchmark from 'benchmark';
import { iterationSuites } from './iteration.suite';

const PRECISION = 2;
const inputSizes = [10, 100];

run().catch((event: any) => {
  console.error('ERROR', event.target.name, event.target.error);
});

async function run(): Promise<void> {
  await runSuites(iterationSuites(inputSizes));
}

function runSuites(suites: readonly Benchmark.Suite[]): Promise<unknown> {
  return Promise.all(suites.map(runSuite));
}

function runSuite(suite: Benchmark.Suite): Promise<void> {
  return new Promise<void>((resolve, reject) => {

    const results: any[] = [];

    const options: Benchmark.Options = {
      maxTime: 1,
    };

    suite.on('start', ({ currentTarget: { name } }: any) => console.log(`\n${name}`));
    suite.on(
        'cycle',
        ({ target: { name, hz, stats = {} as Benchmark.Stats } }: Benchmark.Event) => results.push({
          name: name,
          hz: hz,
          'margin of error': `±${Number(stats.rme).toFixed(2)}%`,
          'runs sampled': stats.sample.length,
        }),
    );
    suite.on('complete', function (this: any) {

      const highestHz = results.slice().sort((a, b) => b.hz - a.hz)[0].hz;

      console.table(
          results
              .sort((a, b) => b.hz - a.hz)
              .map(result => ({
                ...result,
                hz: Math.round(result.hz).toLocaleString(),
                'x slower': Math.round((10 ** PRECISION * highestHz) / result.hz) / 10 ** PRECISION,
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
