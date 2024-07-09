module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // No trailing spaces
    'no-trailing-spaces': 'error',
    
    // Indentation (4 spaces)
    'indent': ['error', 4],
    
    // Consistent line endings
    'linebreak-style': ['error', 'unix'],
    
    // Prefer single quotes
    'quotes': ['error', 'single'],
    
    // Require semicolons
    'semi': ['error', 'always'],
    
    // No multiple empty lines
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    
    // No console logs (warn level)
    'no-console': 'warn',
    
    // Require const for variables that are never reassigned
    'prefer-const': 'error',
    
    // Disallow unused variables
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    
    // Consistent type assertions
    '@typescript-eslint/consistent-type-assertions': 'error',
    
    // Require explicit return types on functions and class methods
    '@typescript-eslint/explicit-function-return-type': 'error',
    
    // Disallow explicit any
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
