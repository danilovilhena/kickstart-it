const acceptedArgs = ["config"];
const args = {};

const defaultConfig = {
  changelog: "keepAChangelog", // "keepAChangelog" | "conventionalChangelog" | false
  commitizen: false, // true | false (only used if changelog is "conventionalChangelog")
  readme: true, // true | false
  gitignore: true, // true | false
  husky: true, // true | false
  language: "js", // "js" | "ts"
  type: "cjs", // "cjs" | "esm"
  env: "node", // "node" | "browser"
  css: false, // false | "sass" | "tailwind" | "mui"
  lint: "eslint", // "eslint" | "standardjs" | false
  eslint: {
    integratePrettier: false, // true | false
    configuration: "standard", // "standard" | "airbnb" | "google" | "recommended"
  },
  format: "prettier", // "prettier" | false (not needed if integratePrettier is true)
  lintStaged: true, // true | false
  test: "jest", // "jest" | "jasmine" | "cypress" | "playwright" | false
  packageManager: "npm", // "npm" | "yarn" | "pnpm"
};

export {
  args,
  acceptedArgs,
  defaultConfig,
}