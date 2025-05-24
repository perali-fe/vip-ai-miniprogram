module.exports = {
  extends: [
    '@tencent/eslint-config-tencent',
    'next/core-web-vitals',
  ],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/display-name': 'off',
  },
};