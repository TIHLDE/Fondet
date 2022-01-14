module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    ".eslintrc.js"
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "prettier/prettier": "warn",
    "import/no-unresolved": 0,
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/no-empty-function": "off",
    "arrow-spacing": "error",
    "block-spacing": ["error", "never"],
    "brace-style": ["error", "1tbs"],
    "comma-spacing": "error",
    "comma-style": ["error", "last"],
    "eol-last": "error",
    "eqeqeq": ["error", "always"],
    "func-call-spacing": "error",
    "guard-for-in": "off",
    "keyword-spacing": "error",
    "max-len": [
      "error",
      {
        "tabWidth": 2,
        "code": 1000,
        "comments": 160,
        "ignoreComments": false,
        "ignoreTrailingComments": false
      }
    ],
    "no-implicit-coercion": "error",
    "no-invalid-this": "off",
    "no-lonely-if": "error",
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1
      }
    ],
    "no-unneeded-ternary": "error",
    "no-useless-computed-key": "off",
    "no-useless-return": "error",
    "no-whitespace-before-property": "error",
    "quote-props": "off",
    "space-before-blocks": "error",
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "asyncArrow": "always",
        "named": "never"
      }
    ]
  },
};
