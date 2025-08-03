module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended', // JSX 접근성 규칙 추가
    'plugin:prettier/recommended', // Prettier 규칙 추가 및 충돌 해결
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'postcss.config.js', 'tailwind.config.js'], // Vite 빌드 결과 및 설정 파일 무시
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } }, // 사용하는 React 버전 명시
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': [
      'warn', // 사용하지 않는 변수에 대한 경고
      { argsIgnorePattern: '^_' }, // 접두사 `_`로 시작하는 인자는 무시
    ],
    // Prettier와 ESLint 충돌 방지는 'plugin:prettier/recommended'가 처리
    'prettier/prettier': [
      'error',
      {
        // Prettier 옵션 (선택 사항, 필요에 따라 추가/수정)
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
        printWidth: 100,
        tabWidth: 2,
        endOfLine: 'auto', // OS에 따라 줄바꿈 문자를 자동으로 처리
      },
    ],
    // Note: you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
