module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['dist', 'public', 'build'],
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': ['error', { code: 150 }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'jsx-a11y/label-has-associated-control': [2, { required: { some: ['nesting', 'id'] } }],
    'arrow-parens': [2, 'as-needed'],
    'import/prefer-default-export': 'off',
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 8 },
      ObjectPattern: { multiline: true, minProperties: 5 },
      ImportDeclaration: { multiline: true, minProperties: 5 },
      ExportDeclaration: { multiline: true, minProperties: 5 },
    }],
    'import/no-extraneous-dependencies': 'off',  // False poistive due to npm workspace
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: { jest: true },
    },
  ],
};
