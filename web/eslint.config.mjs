import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import react from "eslint-plugin-react/configs/recommended.js";
import jsx from "eslint-plugin-react/configs/jsx-runtime.js";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tailwindcss from "eslint-plugin-tailwindcss";
import { fixupPluginRules } from "@eslint/compat";
/*lint
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwindcss.configs["flat/recommended"],
  react,
  jsx,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      "react-hooks": fixupPluginRules(hooks),
    },
    rules: {
      ...hooks.configs.recommended.rules,
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", // or "error"
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
      "import/resolver": {
        typescript: {},
      },
      tailwindcss: {
        callees: ["cx"],
      },
    },
  },
);
