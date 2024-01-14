const acceptedArgs = ['config']
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
  packageManager: 'npm'
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
  Object.assign(config, newConfig)
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
