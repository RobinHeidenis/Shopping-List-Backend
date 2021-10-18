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
  },
  plugins: ["@typescript-eslint", "jest"],
  extends: ["airbnb-base", "prettier"],
  rules: {
    "import/prefer-default-export": 0,
    "import/no-unresolved": 0,
    radix: 0,
    "linebreak-style": "off",
    "import/extensions": "off",
    "no-console": "off",
    "consistent-return": "off",
  },
};
