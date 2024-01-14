const acceptedArgs = ['config', 'outputDir']
const args = {}

const defaultConfig = {
  changelog: 'keepAChangelog',
  commitizen: false,
  readme: true,
  gitignore: true,
  husky: true,
  language: 'js',
  type: 'cjs',
  env: 'node',
  css: false,
  lint: 'eslint',
  eslint: {
    integratePrettier: false,
    configuration: 'standard'
  },
  format: 'prettier',
  lintStaged: true,
  unitTest: 'jest',
  e2eTest: false,
  packageManager: 'npm',
  outputDir: '.'
}

const negativeConfig = {
  changelog: false,
  commitizen: false,
  readme: false,
  gitignore: false,
  husky: false,
  language: 'js',
  type: 'cjs',
  env: 'node',
  css: false,
  lint: false,
  eslint: {
    integratePrettier: false,
    configuration: 'standard'
  },
  format: false,
  lintStaged: false,
  unitTest: false,
  e2eTest: false,
  packageManager: 'npm',
  outputDir: '.'
}

const originalConfig = {}
const config = {}

const setOriginalConfig = (newConfig) => {
  Object.assign(originalConfig, newConfig)
}

const setPartialConfig = (newConfig) => {
  Object.assign(config, newConfig)
}

const setFullConfig = (newConfig) => {
  Object.keys(config).forEach((key) => delete config[key])
  Object.assign(config, { ...negativeConfig, ...newConfig })
}

export {
  args,
  acceptedArgs,
  config,
  defaultConfig,
  originalConfig,
  setOriginalConfig,
  setPartialConfig,
  setFullConfig
}
