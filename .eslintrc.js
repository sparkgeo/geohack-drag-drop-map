module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  globals: {
    document: true,
    FileReader: true,
    alert: true,
    mapboxgl: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  plugins: ['import'],
  ignorePatterns: ['node_modules/'],
  rules: {
    'no-unused-vars': 'warn',
  },
  settings: {
    react: {
      version: 'latest', // "detect" automatically picks the version you have installed.
    },
  },
}
