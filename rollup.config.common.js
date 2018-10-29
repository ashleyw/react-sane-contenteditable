export default {
  input: './src/react-sane-contenteditable.js',
  output: {
    name: 'ReactSaneContenteditable',
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
    },
  },
  plugins: {
    babel: {
      exclude: '**/node_modules/**',
    },
    commonJs: {
      include: '**/node_modules/**',
    },
  },
};
