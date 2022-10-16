import { externalModules } from '@run-z/rollup-helpers';
import path from 'node:path';
import { defineConfig } from 'rollup';
import flatDts from 'rollup-plugin-flat-dts';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

export default defineConfig({
  input: {
    'push-iterator': './src/index.ts',
    'push-iterator.call-thru': './src/call-thru/index.ts',
  },
  plugins: [
    ts({
      typescript,
      tsconfig: 'tsconfig.main.json',
      cacheRoot: 'target/.rts2_cache',
    }),
  ],
  external: externalModules(),
  output: {
    format: 'esm',
    sourcemap: true,
    dir: '.',
    entryFileNames: 'dist/[name].js',
    chunkFileNames: 'dist/_[name].js',
    manualChunks(id) {
      if (id.startsWith(path.resolve('src', 'call-thru') + path.sep)) {
        return 'push-iterator.call-thru';
      }

      return 'push-iterator';
    },
    hoistTransitiveImports: false,
    plugins: [
      flatDts({
        tsconfig: 'tsconfig.main.json',
        lib: true,
        compilerOptions: {
          declarationMap: true,
        },
        entries: {
          'call-thru': {
            file: 'call-thru/index.d.ts',
          },
        },
        internal: ['**/impl/**', '**/*.impl'],
      }),
    ],
  },
});
