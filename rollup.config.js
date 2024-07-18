// rollup.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { cleandir } from 'rollup-plugin-cleandir';
import resolve from '@rollup/plugin-node-resolve';
import obfuscator from 'rollup-plugin-obfuscator';
import typescript from '@rollup/plugin-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const prodOnlyDirs = [
  'src/proto/',
  'src/scripts/',
  'src/utils/',
  'routes/',
  'config/'
];

function filterProdFiles(id) {
  if (!isProduction) {
    return !prodOnlyDirs.some(dir => id.includes(dir));
  }
  return true;
}

export default {
  input: {
    main: 'src/index.ts'
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: !isProduction
  },
  plugins: [
    cleandir('dist'),
    {
      name: 'filter-prod-files',
      resolveId(source, importer) {
        if (importer && !filterProdFiles(source)) {
          return false;
        }
      }
    },
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') }
      ]
    }),
    resolve({
      preferBuiltins: true,
      extensions: ['.js', '.ts']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: !isProduction,
      inlineSources: !isProduction
    }),
    isProduction && terser({
      // ... terser options
    }),
    isProduction && obfuscator({
      // ... obfuscator options
    })
  ].filter(Boolean),
  external: [
    /node_modules/
  ]
};
