module.exports = {
  extends: [
    '@mate-academy/eslint-config',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    jest: true,
  },
  plugins: [
    'jest',
    '@typescript-eslint',
  ],
  rules: {
    'no-proto': 0,
    '@typescript-eslint/no-floating-promises': 'error',
  },
};
