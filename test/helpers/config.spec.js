import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import inquirer from 'inquirer'
import { buildConfig } from '../../src/helpers/config.js'
import { args } from '../../src/helpers/globals.js'

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
  })

  test('buildConfig - should parse config file', async () => {
    args.config = './test/mocks/mockConfig.json'

    await buildConfig().catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()
  })

  test('buildConfig - should exit if config file does not exist', async () => {
    args.config = './test/nonExisting.json'

    await buildConfig().catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('buildConfig - should exit if config file is not a JSON file', async () => {
    args.config = './.gitignore'

    await buildConfig().catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('buildConfig - should exit if config file is invalid', async () => {
    args.config = './test/mocks/mockConfigInvalid.json'

    await buildConfig().catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('buildConfig - should prompt questions', async () => {
    args.config = undefined
    inquirer.prompt = jest.fn().mockImplementation(() => ({ answer: 'answer' }))

    await buildConfig().catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()

    inquirer.prompt.mockRestore()
  })

  test('buildConfig - should prompt questions with conventionalChangelog', async () => {
    args.config = undefined
    inquirer.prompt = jest.fn().mockImplementation((arg) => {
      const values = {
        ...mockPrompts,
        changelog: 'conventionalChangelog',
        lint: 'eslint'
      }
      return { [arg.name]: values[arg.name] }
    })

    await buildConfig().catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()

    inquirer.prompt.mockRestore()
  })

  test('buildConfig - should prompt questions without integratePrettier', async () => {
    args.config = undefined
    inquirer.prompt = jest.fn().mockImplementation((arg) => {
      const values = {
        ...mockPrompts,
        lint: 'standardjs',
        integratePrettier: false
      }
      return { [arg.name]: values[arg.name] }
    })

    await buildConfig().catch((error) => {
      console.error(error)
    })
    expect(mockExit).not.toHaveBeenCalled()

    inquirer.prompt.mockRestore()
  })
})
