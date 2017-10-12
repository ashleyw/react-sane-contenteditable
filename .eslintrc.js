module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  globals: {
    window: true,
    document: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'babel',
    'react',
    'jsx-a11y',
    'import',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'max-len': ['warn', 190],
    'react/forbid-prop-types': [0],
    'no-multi-assign': 0,
  },
};
