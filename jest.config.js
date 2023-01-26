import { configureJest } from '@run-z/project-config';

export default await configureJest({
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/index.ts',
    '!src/benchmarks/**.ts',
    '!**/node_modules/**',
  ],
});
