const extensions = ['.ts', '.tsx', '.js'];

export default {
  input: './src/react-sane-contenteditable.tsx',
  output: {
    name: 'ReactSaneContenteditable',
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
    },
  },
  extensions,
  plugins: {
    babel: {
      extensions,
      exclude: '**/node_modules/**',
    },
    commonJs: {
      include: '**/node_modules/**',
    },
    resolve: {
      extensions,
    },
    typescript: {
      tsconfigOverride: {
        compilerOptions: { composite: false, declaration: false, declarationMap: false },
      },
    },
  },
};
