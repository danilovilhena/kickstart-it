import { logError } from './logger.js'

const isObject = (el) => {
  return el && typeof el === 'object' && !Array.isArray(el) && el.constructor === Object
}

const configSchema = {
  changelog: ['keepAChangelog', 'conventionalChangelog', false],
  commitizen: [true, false],
  readme: [true, false],
  gitignore: [true, false],
  husky: [true, false],
  language: ['js', 'ts'],
  type: ['cjs', 'esm'],
  env: ['node', 'browser'],
  css: ['sass', 'tailwind', 'mui', false],
  lint: ['eslint', 'standardjs', false],
  eslint: {
    integratePrettier: [true, false],
    configuration: ['standard', 'airbnb', 'google', 'recommended']
  },
  format: ['prettier', false],
  lintStaged: [true, false],
  test: ['jest', 'jasmine', 'cypress', 'playwright', false],
  packageManager: ['npm', 'yarn', 'pnpm']
}

const validateSchema = (config) => {
  const extraKeys = Object.keys(config).filter((key) => !Object.keys(configSchema).includes(key))
  if (extraKeys.length > 0) {
    logError(`Invalid keys in config: ${extraKeys.join(', ')}`)
    process.exit(1)
  }

  Object.keys(config).forEach((key) => {
    const value = config[key]
    const schema = configSchema[key]

    if (isObject(schema)) {
      Object.keys(value).forEach((nestedKey) => {
        const nestedValue = value[nestedKey]
        const nestedSchema = schema[nestedKey]

        if (!nestedSchema.includes(nestedValue)) {
          logError(`Invalid value for ${key}.${nestedKey}: ${nestedValue}`)
          process.exit(1)
        }
      })
    } else {
      if (!schema.includes(value)) {
        logError(`Invalid value for ${key}: ${value}`)
        process.exit(1)
      }
    }
  })
}

export {
  validateSchema
}
