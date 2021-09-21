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
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
  },
};

// module.exports = {
//   "root": true,
//   "env": {
//     "browser": true,
//     "es6": true,
//     "node": true
//   },
//   // "settings": {
//   //   "react": {
//   //     "version": "detect"
//   //   }
//   // },
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "sourceType": "module",
//     "ecmaVersion": 2020,
//     "ecmaFeatures": {
//       "jsx": true
//     },
//     // "project": "./tsconfig.eslint.json"
//   },
//   "plugins": ["react", "@typescript-eslint"],
//   "extends": [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/eslint-recommended",
//     "plugin:@typescript-eslint/recommended",
//     // "plugin:react/recommended",
//     "prettier"
//   ],
//   "rules": {
//     "@typescript-eslint/explicit-function-return-type": 0,
//     "@typescript-eslint/no-explicit-any": 0,
//     "@typescript-eslint/no-empty-function": 0,
//     // "react/prop-types": 0,
//     // "react/react-in-jsx-scope": 0,
//     "no-empty-function": 0,
//     "@typescript-eslint/ban-ts-comment": 0
//   }
// }

