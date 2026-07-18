import type { Linter } from "eslint";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig: Linter.Config[] = [
  {
    ignores: [".next/**", "node_modules/**", "cypress/**"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
];

export default eslintConfig;
