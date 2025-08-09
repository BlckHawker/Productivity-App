module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier', // disables conflicting ESLint rules for Prettier
  ],
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
  rules: {
    // Enforce double quotes and semicolons via Prettier (no ESLint fix here)
    // But ESLint warns on formatting if needed (optional)
    
    // Unused variables and imports
    'unused-imports/no-unused-imports-ts': 'warn',
    'unused-imports/no-unused-vars-ts': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // Sorted imports (alphabetically, case-insensitive)
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],

    // Prefer const over let
    'prefer-const': 'warn',

    // Avoid any
    '@typescript-eslint/no-explicit-any': 'warn',

    // Tab indentation, 2 spaces equivalent (see note below)
    // ESLint's 'indent' rule can enforce indentation style
    // We'll configure it for tabs with a visual size of 2 (tabs are single chars, but editors can show width=2)
    indent: ['warn', 'tab', { SwitchCase: 1 }],

    // Remove excessive indentation is partially handled by 'indent' and Prettier formatting

    // Remove excessive line breaks - Prettier handles this mostly

    // Additional rules can be added for line breaks if needed
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};
