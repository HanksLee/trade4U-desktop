module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "extends": [
      "plugin:@typescript-eslint/recommended",
      "react-app",
      // "plugin:prettier/recommended",
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react",
    ],
    rules: {
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/camelcase": 0,
      "@typescript-eslint/consistent-type-assertions": 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/explicit-member-accessibility': 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/interface-name-prefix": 0,
      "@typescript-eslint/no-empty-interface": 0,
      "jsx-a11y/anchor-is-valid": 0,
      "jsx-a11y/heading-has-content": 0,
      "jsx-a11y/accessible-emoji": 0,
      "react/jsx-no-target-blank": 0,
      '@typescript-eslint/indent': ['error', 2],
      'eqeqeq': 0,
      "no-console": 2,
      "semi": 2,
      "max-len": ["error", 140],
      "space-before-blocks": 2,
      "space-infix-ops": 2,
      "padded-blocks": ["error", { "blocks": "never" }],
      "space-in-parens": 2,
      "array-bracket-spacing": 2,
      "object-curly-spacing": ["error", "always"],
      "comma-spacing": 2,
      "comma-dangle": ["error", {
        "arrays": "never",
        "objects": "always",
        "imports": "never",
        "exports": "never",
        "functions": "never"
      }],
      "id-length": 0,
      "camelcase": 0,
      "new-cap": 2,
    }
};