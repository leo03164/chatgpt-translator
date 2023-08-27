module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'import',
  ],
  rules: {
    'no-console': 0,
    'import/no-unresolved': [
      'error',
      { ignore: ['^@'] },
    ],
    'import/named': 2,
    'import/export': 2,
    'import/prefer-default-export': 0,
  },
};
