import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import inquirer from 'inquirer'
import { promptQuestions } from '../../src/helpers/prompt.js'
import { args, config } from '../../src/helpers/globals.js'

jest.mock('inquirer', () => ({
  prompt: jest.fn()
}))

jest.spyOn(console, 'error').mockImplementation(() => {})
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error()
})

const mockPrompts = {
  changelog: 'keepAChangelog',
  readme: true,
  gitignore: true,
  husky: true,
  language: 'js',
  type: 'cjs',
  env: 'node',
  css: false,
  lint: 'eslint',
  integratePrettier: true,
  configuration: 'standard',
  unitTest: 'jest',
  e2eTest: false,
  packageManager: 'npm'
}

describe('config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.keys(config).forEach((key) => delete config[key])
  })

  test('promptQuestions - should parse config file', async () => {
    args.config = './test/mocks/mockConfig.json'

    await promptQuestions().catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()
  })

  test('promptQuestions - should parse partial config file', async () => {
    args.config = './test/mocks/mockPartialConfig.json'

    await promptQuestions().catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()
    expect(config).toStrictEqual({
      changelog: 'keepAChangelog',
      commitizen: false,
      css: false,
      e2eTest: false,
      env: 'node',
      eslint: {
        configuration: 'standard',
        integratePrettier: false
      },
      format: false,
      gitignore: false,
      husky: false,
      language: 'js',
      lint: false,
      lintStaged: false,
      outputDir: '.',
      packageManager: 'npm',
      readme: false,
      type: 'cjs',
      unitTest: false
    })
  })

  test('promptQuestions - should exit if config file does not exist', async () => {
    args.config = './test/nonExisting.json'

    await promptQuestions().catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('promptQuestions - should exit if config file is not a JSON file', async () => {
    args.config = './.gitignore'

    await promptQuestions().catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('promptQuestions - should exit if config file is invalid', async () => {
    args.config = './test/mocks/mockConfigInvalid.json'

    await promptQuestions().catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('promptQuestions - should prompt questions', async () => {
    args.config = undefined
    inquirer.prompt = jest.fn().mockImplementation(() => ({ answer: 'answer' }))

    await promptQuestions().catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()

    inquirer.prompt.mockRestore()
  })

  test('promptQuestions - should prompt questions with conventionalChangelog', async () => {
    args.config = undefined
    inquirer.prompt = jest.fn().mockImplementation((arg) => {
      const values = {
        ...mockPrompts,
        changelog: 'conventionalChangelog',
        lint: 'eslint'
      }
      return { [arg.name]: values[arg.name] }
    })

    await promptQuestions().catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()

    inquirer.prompt.mockRestore()
  })

  test('promptQuestions - should prompt questions without integratePrettier', async () => {
    args.config = undefined
    inquirer.prompt = jest.fn().mockImplementation((arg) => {
      const values = {
        ...mockPrompts,
        lint: 'standardjs',
        integratePrettier: false
      }
      return { [arg.name]: values[arg.name] }
    })

    await promptQuestions().catch((error) => {
      console.error(error)
    })
    expect(mockExit).not.toHaveBeenCalled()

    inquirer.prompt.mockRestore()
  })
})
