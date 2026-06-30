import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import unoCSS from 'unocss/vite';
import { defineConfig } from 'vite-plus';

const __dirname = import.meta.dirname;

export default defineConfig({
  staged: {
    '*.{js,ts,tsx,vue,yaml,yml,md}': 'pnpm lint --fix && pnpm format:fix && pnpm spellcheck',
  },
  fmt: {
    singleQuote: true,
    singleAttributePerLine: true,
    useTabs: false,
    trailingComma: 'all',
    semi: true,
    quoteProps: 'as-needed',
    objectWrap: 'preserve',
    insertFinalNewline: true,
    endOfLine: 'lf',
    embeddedLanguageFormatting: 'auto',
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    printWidth: 100,
    tabWidth: 2,
    sortPackageJson: true,
    jsxSingleQuote: false,
    vueIndentScriptAndStyle: true,
    proseWrap: 'preserve',
    sortTailwindcss: {},
    sortImports: {
      internalPattern: ['@/', '~/'],
    },
  },
  lint: {
    plugins: ['typescript', 'vue', 'vitest', 'promise', 'unicorn', 'import'],
    categories: {
      correctness: 'error',
      perf: 'error',
      suspicious: 'error',
      restriction: 'error',
      pedantic: 'error',
    },
    env: {
      builtin: true,
    },
    ignorePatterns: ['playground', 'public'],
    rules: {
      'no-console': ['error', { allow: ['error'] }],
      'no-unsafe-type-assertion': 'off',
      'no-extraneous-class': 'off',
      'no-relative-parent-imports': 'off',
      'no-invalid-void-type': 'off',
      'class-methods-use-this': 'off',
      'no-empty-function': 'off',
      'no-undefined': 'off',
      'no-alert': 'off',
      'import/unambiguous': 'off',
      'max-classes-per-file': ['error', 2],
      'max-dependencies': ['error', 15],
      'no-inline-comments': 'off',
      'typescript/prefer-readonly-parameter-types': 'off',
      'no-unassigned-import': [
        'error',
        {
          allow: ['**/*.css'],
        },
      ],
      'max-props': [
        'error',
        {
          maxProps: 12,
        },
      ],
    },
    overrides: [
      {
        files: ['src/**/*.test.ts', 'src/features/**/*.stories.ts'],
        rules: {
          '@typescript-eslint/no-non-null-assertion': 'off',
          'no-empty-function': 'off',
          'strict-void-return': 'off',
          'no-non-null-asserted-optional-chain': 'off',
          'no-abusive-eslint-disable': 'off',
          'max-dependencies': 'off',
        },
      },
      {
        files: ['src/features/**/*.stories.ts'],
        rules: {
          'typescript/no-unnecessary-type-arguments': 'off',
          'typescript/explicit-function-return-type': 'off',
        },
      },
      {
        files: ['src/**/*.webc.ts'],
        rules: {
          'no-unsafe-argument': 'off',
        },
      },
      {
        files: ['src/**/*.test.ts'],
        rules: {
          'no-await-in-loop': 'off',
          'no-empty-function': 'off',
          'require-test-timeout': 'off',
          '@typescript-eslint/unbound-method': 'off',
          'no-shadow': 'off',
          'no-unnecessary-type-assertion': 'off',
          'no-object-as-default-parameter': 'off',
          'require-await': 'off',
        },
      },
      {
        files: [
          'src/**/*.test.ts',
          'tools/ci/**/*.ts',
          'tools/vite/**/*.ts',
          'src/features/**/*.stories.ts',
          'src/config.ts',
        ],
        rules: {
          'no-async-await': 'off',
          'strict-boolean-expressions': 'off',
          'no-unsafe-member-access': 'off',
          'no-unsafe-return': 'off',
          'no-unsafe-assignment': 'off',
          'no-unsafe-call': 'off',
          'no-unsafe-argument': 'off',
          'max-lines-per-function': 'off',
          'max-lines': 'off',
          'no-promise-executor-return': 'off',
          'prefer-top-level-await': 'off',
        },
      },
      {
        files: ['tools/ci/**/*.ts'],
        rules: {
          'no-console': 'off',
          '@typescript-eslint/no-non-null-assertion': 'off',
          'typescript/no-floating-promises': 'off',
          'no-optional-chaining': 'off',
          'only-used-in-recursion': 'off',
          complexity: 'off',
          'no-use-before-define': 'off',
          'no-await-in-loop': 'off',
          'no-plusplus': 'off',
          'always-return': 'off',
          'no-relative-parent-imports': 'off',
          'no-void': 'off',
          'no-process-exit': 'off',
        },
      },
      {
        files: ['tools/vitest/**/*.ts'],
        rules: {
          'no-empty-function': 'off',
          'no-default-export': 'off',
          'class-methods-use-this': 'off',
        },
      },
      {
        files: [
          'tools/vite/**/*.ts',
          'src/entries/index.ts',
          'commitlint.config.js',
          'vite.config.ts',
          'uno.config.ts',
          'tools/storybook/*.ts',
          'src/features/**/*.stories.ts',
        ],
        rules: {
          'no-default-export': 'off',
        },
      },
      {
        files: ['tools/ci/**/*.ts', 'src/shims-vue.d.ts'],
        rules: {
          unambiguous: 'off',
        },
      },
      {
        files: ['tools/**/*.ts'],
        rules: {
          'prefer-module': 'off',
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: false,
    },
  },
  plugins: [vue(), unoCSS()],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['html', 'cobertura', 'text-summary', 'lcov', 'json-summary'],
      include: ['src/**/*.{js,ts,vue,jsx,tsx}'],
      exclude: [
        'src/features/shared/lib/utils/webc-story-helpers.ts',
        'node_modules/',
        'dist/',
        '**/*.config.*',
        'coverage/**',
        '**/*.stories.*',
        '**/*.test.*',
        '**/*.webc.ts',
        '**/*.spec.*',
        '**/*.contract.ts',
        'playground/**',
        'src/assets/**',
        'mocks/**',
        '__mock__/**',
        '.storybook',
        'entries/**',
        'tools/**',
      ],
      reportOnFailure: true,
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './coverage/junit.xml',
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tools/vitest/setup.ts'],
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'tests/**', 'playground/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  run: {
    tasks: {
      'task:build:lib': {
        command: 'pnpm build:lib',
        input: ['src/**/*'],
      },
      'task:build:webc': {
        command: 'pnpm build:webc',
        dependsOn: ['task:build:lib'],
      },
      'task:build:storybook': {
        command: 'storybook build',
        dependsOn: ['task:build:webc'],
      },
      'task:css:check': {
        command: 'pnpm css:check',
        dependsOn: ['task:build:lib'],
        input: ['dist/lib/core.css'],
      },
      'task:test': {
        command: 'pnpm test',
        input: ['src/**/*'],
      },
      'task:pre-commit': {
        command: 'vp staged',
      },
      'task:pre-push': {
        command: 'vp check && vp run task:css:check && vp run task:test',
      },
    },
  },
});
