import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import playwright from 'eslint-plugin-playwright'

export default defineConfig([
  {
    ignores: [
      'playwright-report/',
      'test-results/',
      'junit/',
      '.features-gen/',
      'docker/'
    ]
  },

  js.configs.recommended,

  {
    ...playwright.configs['flat/recommended'],
    files: ['test/**/*.js']
  },

  {
    files: ['test/**/*.js'],
    rules: {
      // playwright-bdd step definitions legitimately call `expect` outside a
      // `test()` block, and assertions live in steps rather than spec bodies.
      'playwright/no-standalone-expect': 'off',
      'playwright/expect-expect': 'off'
    }
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },

  eslintConfigPrettier
])
