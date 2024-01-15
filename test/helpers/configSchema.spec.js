import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import chalk from 'chalk'
import { validateSchema } from '../../src/helpers/configSchema.js'
import { defaultConfig } from '../../src/helpers/globals.js'

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error()
})

describe('validateSchema', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should not throw error for valid config', () => {
    const config = { ...defaultConfig }

    validateSchema(config)
    expect(mockConsoleError).not.toHaveBeenCalled()
    expect(mockExit).not.toHaveBeenCalled()
  })

  test('should exit for extra keys in config', () => {
    const config = {
      ...defaultConfig,
      invalidKey: 'invalidValue'
    }

    try { validateSchema(config) } catch (error) {}

    expect(mockConsoleError).toHaveBeenCalledWith(chalk.red('[ERROR] Invalid keys in config: invalidKey'))
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  test('should exit for invalid value', () => {
    const config = {
      ...defaultConfig,
      changelog: 'invalidValue'
    }

    try { validateSchema(config) } catch (error) {}

    expect(mockConsoleError)
      .toHaveBeenCalledWith(chalk.red('[ERROR] Invalid value for changelog: invalidValue'))
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  test('should exit for invalid nested value', () => {
    const config = {
      ...defaultConfig,
      eslint: { integratePrettier: 'invalidValue' }
    }

    try { validateSchema(config) } catch (error) {}

    expect(mockConsoleError)
      .toHaveBeenCalledWith(chalk.red('[ERROR] Invalid value for eslint.integratePrettier: invalidValue'))
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  test('should exit for invalid regex value', () => {
    const config = {
      ...defaultConfig,
      outputDir: ''
    }

    try { validateSchema(config) } catch (error) {}

    expect(mockConsoleError)
      .toHaveBeenCalledWith(chalk.red('[ERROR] Invalid value for outputDir: '))
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
