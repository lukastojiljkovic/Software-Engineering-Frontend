// ESLint config za SAST: code-pattern scan (OWASP-style obrasci).
// Pokrece se SAMO u CI kao `eslint-security` job (vidi .github/workflows/ci.yml).
// Odvojen je od `eslint.config.js` (koji koristi React/TS plugin-e) jer bi
// security plugin pravila pucala lokalno na svaki `npm run lint` — too noisy.
//
// Pravila:
//  - detect-eval-with-expression: ERROR (svaki `eval(string)` puca build)
//  - detect-non-literal-fs-filename: ERROR (fs.readFile(userInput) — path traversal)
//  - detect-non-literal-require: ERROR (require(userInput) — module poisoning)
//  - detect-unsafe-regex: WARN (false positive prone — npr. validation patterns)
//  - detect-pseudoRandomBytes: ERROR (crypto.pseudoRandomBytes — kriptografski slabo)
//
// Napomena: koristimo `defineConfig` umesto `--rule` flag-a jer ESLint 10 sa
// `--no-config-lookup` ima bug sa glob-ovima ("all files matching pattern are ignored").
// Eksplicitan config sa `files: ['src/**/*.{ts,tsx,js,jsx}']` resava problem.

import security from 'eslint-plugin-security';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      // TypeScript parser je nuzan da bi ESLint mogao da parse-uje .ts/.tsx fajlove
      // (default parser je Espree koji ne razume `type X = ...`, `: Type` annotations,
      // `as` cast-ove, itd.).
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // `linterOptions.reportUnusedDisableDirectives: 'off'` jer kod sadrzi
    // `eslint-disable-next-line react-hooks/*` komentare koji se odnose na pravila
    // ne ucitana u OVOM config-u (security scan, ne main lint config). Bez ovog,
    // ESLint bi izbacio "Unused eslint-disable directive" warnings — overhead.
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    plugins: {
      // Plugin-i ispod su ucitani SAMO da ESLint moze da resolve-uje
      // `eslint-disable-next-line react-hooks/exhaustive-deps` direktive u kodu.
      // Sva njihova pravila su iskljucena (security scan ih ne treba).
      security,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-require': 'error',
      'security/detect-unsafe-regex': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
    },
  },
]);
