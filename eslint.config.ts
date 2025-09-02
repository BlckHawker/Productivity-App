import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from "eslint/config";

const requireExplicitGenerics = require("eslint-plugin-require-explicit-generics");

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { 
      js, 
      requireExplicitGenerics, 
      "@stylistic": stylistic 
    }, 
    rules: {
      "no-warning-comments": [
        "error"
      ],
      "requireExplicitGenerics/require-explicit-generics": ["error", ["useState", "React.useState"]],
      "@stylistic/quotes": ["error", "double"]
    },
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: {...globals.browser, ...globals.node} 
    } 
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
