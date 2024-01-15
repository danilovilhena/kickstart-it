import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { args, config, setFullConfig, setPartialConfig, setOriginalConfig } from './globals.js'
import { validateSchema } from './configSchema.js'
import { logError } from './logger.js'

const promptValues = {
  changelog: {
    message: 'Would you like to add a CHANGELOG?',
    choices: [
      { name: `Keep a Changelog ${chalk.dim('(recommended)')}`, value: 'keepAChangelog' },
      { name: 'Conventional Changelog', value: 'conventionalChangelog' },
      { name: 'No', value: false }
    ]
  },
  commitizen: {
    message: 'Would you like to use Commitizen?',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false }
    ]
  },
  readme: {
    message: 'Would you like to add a README?',
    choices: [
      { name: 'Yes, with a basic template', value: true },
      { name: 'No', value: false }
    ]
  },
  gitignore: {
    message: 'Would you like to add a .gitignore file?',
    choices: [
      { name: `Yes, with a general template ${chalk.dim('(recommended)')}`, value: true },
      { name: 'No', value: false }
    ]
  },
  husky: {
    message: 'Would you like to add Husky 🐶?',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false }
    ]
  },
  language: {
    message: 'Which language would you like to use?',
    choices: [
      { name: 'JavaScript', value: 'js' },
      { name: 'TypeScript', value: 'ts' }
    ]
  },
  type: {
    message: 'Which module system would you like to use?',
    choices: [
      { name: `CommonJS - ${chalk.green("const path = require('path')")}`, value: 'cjs' },
      { name: `ES Modules - ${chalk.green("import path from 'path'")}`, value: 'esm' }
    ]
  },
  env: {
    message: 'Where will your project run?',
    choices: [
      { name: 'Node.js', value: 'node' },
      { name: 'Browser', value: 'browser' }
    ]
  },
  css: {
    message: 'Would you like to use a CSS framework?',
    choices: [
      { name: 'Sass', value: 'sass' },
      { name: 'Tailwind CSS', value: 'tailwind' },
      { name: 'Material UI', value: 'mui' },
      { name: 'No', value: false }
    ]
  },
  lint: {
    message: 'Which linter would you like to use?',
    choices: [
      { name: 'ESLint', value: 'eslint' },
      { name: 'StandardJS', value: 'standardjs' },
      { name: 'No', value: false }
    ]
  },
  integratePrettier: {
    message: 'Would you like to integrate Prettier with ESLint?',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false }
    ]
  },
  configuration: {
    message: 'Choose the configuration for ESLint:',
    choices: [
      { name: 'Standard', value: 'standard' },
      { name: 'Airbnb', value: 'airbnb' },
      { name: 'Google', value: 'google' },
      { name: 'Recommended', value: 'recommended' }
    ]
  },
  format: {
    message: 'Would you like to use a formatter?',
    choices: [
      { name: 'Prettier', value: 'prettier' },
      { name: 'No', value: false }
    ]
  },
  lintStaged: {
    message: 'Would you like to use a lint-staged?',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false }
    ]
  },
  unitTest: {
    message: 'Would you like to use a unit testing framework?',
    choices: [
      { name: 'Jest', value: 'jest' },
      { name: 'Jasmine', value: 'jasmine' },
      { name: 'No', value: false }
    ]
  },
  e2eTest: {
    message: 'Would you like to use an end-to-end testing framework?',
    choices: [
      { name: 'Cypress', value: 'cypress' },
      { name: 'Playwright', value: 'playwright' },
      { name: 'No', value: false }
    ]
  },
  packageManager: {
    message: 'Which package manager would you like to use?',
    choices: [
      { name: 'npm', value: 'npm' },
      { name: 'Yarn', value: 'yarn' },
      { name: 'pnpm', value: 'pnpm' }
    ]
  }
}

const prompt = async (name, returnValue = false) => {
  const { message, choices } = promptValues[name]
  const { [name]: result } = await inquirer.prompt({
    type: 'list',
    prefix: `${chalk.magenta('?')}`,
    name,
    message,
    choices
  })

  if (returnValue) return result
  setPartialConfig({ [name]: result })
}

const promptQuestions = async () => {
  if (args.config) {
    const configPath = path.resolve(process.cwd(), args.config)

    if (!fs.existsSync(configPath)) logError("The config file provided doesn't exist!")
    if (!configPath.endsWith('.json')) logError('The config file provided is not a JSON file!')

    try {
      const parsedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      validateSchema(parsedConfig)
      setFullConfig(parsedConfig)
      setOriginalConfig(parsedConfig)
      return
    } catch (error) {
      logError('Failed to parse the config file provided!')
    }
  }

  await prompt('changelog')
  if (config.changelog === 'conventionalChangelog') await prompt('commitizen')
  await prompt('readme')
  await prompt('gitignore')
  await prompt('husky')
  await prompt('language')
  await prompt('type')
  await prompt('env')
  await prompt('css')

  await prompt('lint')
  if (config.lint === 'eslint') {
    config.eslint = {
      integratePrettier: await prompt('integratePrettier', true),
      configuration: await prompt('configuration', true)
    }
  }
  if (!config?.eslint?.integratePrettier) await prompt('format')
  if (config.format === 'prettier' || ['eslint', 'standardjs'].includes(config.lint)) await prompt('lintStaged')

  await prompt('unitTest')
  await prompt('e2eTest')
  await prompt('packageManager')

  setOriginalConfig(config)
}

export {
  promptQuestions
}
