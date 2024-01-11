const defaultConfig = {
  changelog: "keepAChangelog", // "keepAChangelog" | "conventionalChangelog" | false
  commitizen: false, // true | false (only used if changelog is "conventionalChangelog")
  readme: "basic", // "basic" | "detailed" | false
  gitignore: true, // true | false
  husky: true, // true | false
  language: "js", // "js" | "ts"

  type: "node", // "node" | "browser"
  node: {
    moduleSystem: "cjs", // "cjs" | "esm",
    framework: false, // false | "express" | "fastify"
  },
  browser: {
    framework: false, // false | "react" | "vue" | "angular"
    reactVariation: "default", // "default" | "nextjs" | "gatsby" | "preact" (only used if framework is "react")
    vueVariation: "default", // "default" | "nuxt" | vite (only used if framework is "vue")
    angularVariation: "default", // "default" | "universal" | "nx-workspace" (only used if framework is "angular")
    css: false, // false | "sass" | "tailwind" | "bootstrap" | "mui"
  },

  lint: "eslint", // "eslint" | "Standardjs" | false
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
