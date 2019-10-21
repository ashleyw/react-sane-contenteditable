const path = require('path');
const webpack = require('webpack');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = ({ config }) => {
  config.resolve.extensions.push('.ts', '.tsx', '.mdx');

  config.module.rules.unshift({
    test: /\.tsx?$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
        options: {
          configFileName: path.resolve(__dirname, '../tsconfig.json'),
        },
      },
      {
        loader: require.resolve('react-docgen-typescript-loader'),
        options: {
          tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
        },
      },
    ],
  });

  config.module.rules.push({
    test: /\.stories\.tsx$/,
    loaders: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: { parser: 'typescript' },
      },
    ],
    enforce: 'pre',
  });

  config.module.rules.push({
    test: /\.stories\.jsx?$/,
    loader: require.resolve('@storybook/source-loader'),
    exclude: [/node_modules/],
    enforce: 'pre',
  });

  config.module.rules.push({
    test: /\.stories\.mdx$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              '@babel/plugin-transform-react-jsx',
              {
                pragmaFrag: 'React.Fragment',
              },
            ],
          ],
        },
      },
      {
        loader: '@mdx-js/loader',
        options: {
          compilers: [createCompiler({})],
        },
      },
    ],
  });

  return config;
};
