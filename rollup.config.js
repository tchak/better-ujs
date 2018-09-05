import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'test/ujs-test.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      presets: [
        ['@babel/preset-env', { modules: false }]
      ],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread'
      ],
      exclude: 'node_modules/**'
    })
  ]
};
