const defaultConfig = {
  changelog: "keepAChangelog", // "keepAChangelog" | "conventionalChangelog" | false
  commitizen: false, // true | false (only used if changelog is "conventionalChangelog")
  readme: true, // true | false
  gitignore: true, // true | false
  husky: true, // true | false
  language: "js", // "js" | "ts"

  type: "cjs", // "cjs" | "esm",
  css: false, // false | "sass" | "tailwind" | "bootstrap" | "mui"
  lint: "eslint", // "eslint" | "standardjs" | false
  eslint: {
    integratePrettier: true, // true | false
    configuration: "standard", // "standard" | "airbnb" | "google" | "recommended" | "prettier"
  },
  format: "prettier", // "prettier" | false
  lintStaged: true, // true | false
  
  bundler: "webpack", // "webpack" | "rollup" | "vite" | "parcel" | false
  integrateBabel: false, // true | false
  test: "jest", // "jest" | "mocha+chai" | "jasmine" | "cypress" | "playwright" | false
  packageManager: "npm", // "npm" | "yarn" | "pnpm"
  ci: "githubActions", // "githubActions" | "gitlabCI" | "circleCI" | "travisCI" | "jenkins" | false
};

export default defaultConfig;
