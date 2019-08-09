import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import jsx from 'rollup-plugin-jsx';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

import common from './rollup.config.common';

export default {
  input: 'example/index.tsx',
  output: {
    file: 'example/index.min.js',
    format: 'iife',
    globals: common.output.globals,
    name: common.output.name,
  },
  plugins: [
    resolve(common.plugins.resolve),
    typescript(common.plugins.typescript),
    babel(common.plugins.babel),
    commonjs({
      include: common.plugins.commonJs.include,
      exclude: ['node_modules/process-es6/**'],
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render'],
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    jsx({ factory: 'React.createElement' }),
    serve('example'),
  ],
};
