// do not remove these!
/* eslint-disable @typescript-eslint/no-require-imports */

import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

const requireExplicitGenerics = require("eslint-plugin-require-explicit-generics");

export default defineConfig([
	{ 
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
		plugins: { 
			js, 
			requireExplicitGenerics, 
			"@stylistic": stylistic,
			"unused-imports": unusedImports,
		}, 
		rules: {
			"no-warning-comments": [
				"warn"
			],
			"requireExplicitGenerics/require-explicit-generics": ["error", ["useState", "React.useState"]],
			"@stylistic/quotes": ["error", "double"],
			"no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
			"unused-imports/no-unused-imports": "warn",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					"vars": "all",
					"varsIgnorePattern": "^_",
					"args": "after-used",
					"argsIgnorePattern": "^_",
				},
			],
			"sort-imports": ["warn", {
				"ignoreCase": false,
				"ignoreDeclarationSort": false,
				"ignoreMemberSort": false,
				"memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
				"allowSeparatedGroups": false
			}],
			"semi": ["error", "always"],
			"indent": ["error", "tab"],
			"@stylistic/no-multiple-empty-lines": ["error", {
				"max": 2,
				"maxEOF": 0,
				"maxBOF": 0
			}]
		},
		extends: ["js/recommended", ], 
		languageOptions: { 
			globals: {...globals.browser, ...globals.node} 
		}
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	globalIgnores(["backend/prisma/*", "backend/generated/*"]) 

]);
