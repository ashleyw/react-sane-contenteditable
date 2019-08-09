import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';

import common from './rollup.config.common';

const external = Object.keys(common.output.globals);

export default [
  {
    input: common.input,
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: common.output.name,
      globals: common.output.globals,
    },
    external,
    plugins: [
      resolve(common.plugins.resolve),
      commonjs(common.plugins.commonJs),
      typescript(common.plugins.typescript),
      babel(common.plugins.babel),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      sizeSnapshot(),
    ],
  },
  {
    input: common.input,
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      globals: common.output.globals,
      name: common.output.name,
    },
    external,
    plugins: [
      resolve(common.plugins.resolve),
      commonjs(common.plugins.commonJs),
      typescript(common.plugins.typescript),
      babel(common.plugins.babel),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      sizeSnapshot(),
      uglify(),
    ],
  },
  {
    input: common.input,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      name: common.output.name,
    },
    external: id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
    plugins: [typescript(common.plugins.typescript), babel(common.plugins.babel), sizeSnapshot()],
  },
];
