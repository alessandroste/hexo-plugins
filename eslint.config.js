import jslint from "@eslint/js";
import { Linter } from "eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tslint from "typescript-eslint";

/** @type {Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        hexo: 'readonly'
      }
    }
  },
  {
    ignores: [
      'node_modules',
      '**/node_modules',
      '**/dist',
      'eslint.config.js'
    ]
  },
  jslint.configs.recommended,
  ...tslint.configs.recommended,
  eslintConfigPrettier,
];