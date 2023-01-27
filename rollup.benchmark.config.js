import nodeResolve from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import { createRequire } from 'node:module';
import { defineConfig } from 'rollup';
import unbundle from 'rollup-plugin-unbundle';
import typescript from 'typescript';

const req = createRequire(import.meta.url);
const pkg = req('./package.json');

export default defineConfig({
  input: './src/benchmarks/main.ts',
  plugins: [
    nodeResolve(),
    ts({
      typescript,
      tsconfig: 'tsconfig.benchmark.json',
      cacheDir: 'target/benchmark/.rts_cache',
    }),
    unbundle(),
  ],
  external: [...Object.keys(pkg.devDependencies)],
  output: {
    format: 'esm',
    sourcemap: true,
    file: './target/benchmark.js',
  },
});
