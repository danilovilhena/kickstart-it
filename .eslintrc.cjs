module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "2023",
    sourceType: "module",
  },
  env: {
		es6: true,
		node: true,
	},
  extends: [
		"eslint:recommended",
	],
  plugins: [
		"json",
	],
  ignorePatterns: [
    "dist",
    "coverage",
  ],
  rules: {
    curly: ["error", "multi-line"],
    "import/extensions": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-duplicate-imports": "error",
		"no-unused-vars": ["error", { ignoreRestSiblings: true }],
    quotes: ["error", "double", { avoidEscape: true }],
    "prefer-promise-reject-errors": "error",
  },
};
