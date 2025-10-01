// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // 1) Ignore build artifacts and the config file itself
  { ignores: ["dist", "node_modules", "eslint.config.mjs"] },

  // 2) Base JS + TypeScript (type-aware) configs
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // 3) Project-level settings and rule tweaks
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname, // uses server/tsconfig.json
      },
    },
    rules: {
      // your preferences
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
    },
  },

  // 4) Turn off rules that conflict with Prettier (MUST be last)
  eslintConfigPrettier,
);
