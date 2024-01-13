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
  test: 'jest',
  packageManager: 'npm'
}

export {
  args,
  acceptedArgs,
  defaultConfig
}
