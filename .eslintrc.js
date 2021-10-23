module.exports = {
  env: {
    es2021: true,
    node: true,
    "jest/globals": true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:node/recommended",
    "airbnb-base",
    "airbnb-typescript/base",
    "prettier",
  ],
  rules: {
    "import/prefer-default-export": 0,
    "import/no-unresolved": 0,
    radix: 0,
    "linebreak-style": "off",
    "import/extensions": "off",
    "no-console": "off",
    "consistent-return": "off",
    "node/no-unsupported-features/es-syntax": "off",
    "node/no-missing-import": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/no-cycle": "off",
    "class-methods-use-this": "off",
    "node/no-unpublished-require": "off",
  },
};
