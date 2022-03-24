module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: [
    ".eslintrc.js"
  ],
  "plugins": [
    "googleappsscript"
  ],
  "env": {
    "googleappsscript/googleappsscript": true,
    "es6": true
  },
  rules: {
    "prettier/prettier": "warn",
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
    "no-unused-vars": ["error", { "vars": "local" }], // Global functions executed by menus will appear to be unused, this is ok.
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
