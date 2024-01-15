import fs from 'fs'
import { describe, expect, jest, test } from '@jest/globals'
import { kickstart } from '../../src/core/index.js'
import { args, setPartialConfig } from '../../src/helpers/globals.js'
import { exec } from '../../src/helpers/index.js'

jest.spyOn(process, 'exit').mockImplementation(() => {})
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

fs.mkdirSync = jest.fn().mockImplementation(() => {})

describe('checkForOutputDir', () => {
  test('should return if there\'s no config or args', () => {
    setPartialConfig({ outputDir: undefined })
    kickstart()
    expect(mockConsoleLog).not.toHaveBeenCalled()
  })

  test('should create dir if it\'s defined in config', () => {
    setPartialConfig({ outputDir: 'mocks' })
    kickstart()
    expect(fs.mkdirSync).toHaveBeenCalled()
  })

  test('should create dir if it\'s defined in args', () => {
    args.outputDir = 'mocks'
    kickstart()
    expect(fs.mkdirSync).toHaveBeenCalled()
  })

  test('should throw error if can\'t create dir', () => {
    args.outputDir = 'mocks'
    fs.mkdirSync = jest.fn().mockImplementationOnce(() => { throw new Error() })
    kickstart().catch(() => {})
    expect(fs.mkdirSync).toHaveBeenCalled()
    expect(mockConsoleError).toHaveBeenCalled()
  })

  test('should change dir it\'s created', () => {
    const mockChdir = jest.spyOn(process, 'chdir').mockImplementationOnce(() => {})
    args.outputDir = 'test'
    kickstart()
    expect(fs.mkdirSync).not.toHaveBeenCalled()
    expect(mockChdir).toHaveBeenCalledWith('test')
  })
})

describe('checkForPackageJson and checkForGit', () => {
  const mockDir = 'test/mockDir'

  test('should create both files', async () => {
    setPartialConfig({ packageManager: 'npm' })
    args.outputDir = mockDir
    await kickstart()

    expect(fs.existsSync('./package.json')).toBe(true)
    expect(fs.existsSync('./.git')).toBe(true)

    process.chdir('../..')

    await exec({ command: `rm -rf ${mockDir} && mkdir ${mockDir} && touch ${mockDir}/.gitkeep` })
  })

  test('should exec with pnpm and win32', async () => {
    setPartialConfig({ packageManager: 'pnpm' })
    args.outputDir = mockDir
    await kickstart()

    expect(mockConsoleError).not.toHaveBeenCalled()

    process.chdir('../..')
    await exec({ command: `rm -rf ${mockDir} && mkdir ${mockDir} && touch ${mockDir}/.gitkeep` })
  })
})
