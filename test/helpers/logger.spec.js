import { describe, expect, jest, test } from '@jest/globals'
import chalk from 'chalk'
import { logError, logSuccess, logWarning, startLoading, stopLoading } from '../../src/helpers/logger'

jest.mock('ora', () => {
  return jest.fn().mockImplementation(() => ({ start: jest.fn(), stop: jest.fn() }))
})

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
const mockStdoutClearLine = jest.spyOn(process.stdout, 'clearLine').mockImplementation(() => {})
const mockStdoutCursorTo = jest.spyOn(process.stdout, 'cursorTo').mockImplementation(() => {})

describe('logger', () => {
  test('logWarning - should log message', () => {
    logWarning('Warning message')
    expect(mockConsoleLog).toHaveBeenCalledWith(chalk.yellow('Warning message'))
  })

  test('logSuccess - should log message with checkmark', () => {
    logSuccess('Success message')
    expect(mockConsoleLog).toHaveBeenCalledWith(`✓ ${chalk.green('Success message')}`)
  })

  test('logSuccess -  should log message without checkmark', () => {
    logSuccess('Success message', false)
    expect(mockConsoleLog).toHaveBeenCalledWith(chalk.green('Success message'))
  })

  test('logError - should log a message', () => {
    logError('Error message')
    expect(mockConsoleError).toHaveBeenCalledWith(chalk.red('[ERROR] Error message'))
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  test('should start and stop loading', () => {
    startLoading('Loading...')
    stopLoading()
    expect(mockStdoutClearLine).toHaveBeenCalled()
    expect(mockStdoutCursorTo).toHaveBeenCalledWith(0)
  })
})
