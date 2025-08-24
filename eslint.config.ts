/* eslint-disable @typescript-eslint/no-require-imports */
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
const requireExplicitGenerics = require("eslint-plugin-require-explicit-generics");

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { 
      js, 
      "require-explicit-generics": requireExplicitGenerics,
    },

    rules: {
        "require-explicit-generics/require-explicit-generics": ["error", ["useState", "React.useState"]],
    },
    extends: ["js/recommended"], 
    languageOptions: { globals: {...globals.browser, ...globals.node} 
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
