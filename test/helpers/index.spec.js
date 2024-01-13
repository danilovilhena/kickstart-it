import fs from 'fs'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { cloneFile, exec, formatTime, parseArgs, spawn } from '../../src/helpers/index.js'

jest.spyOn(console, 'error').mockImplementation(() => {})
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error()
})

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('cloneFile', async () => {
    const source = './test/mocks/mockFile.txt'
    const destination = './test/mocks/mockFileCopy.txt'

    await cloneFile(source, destination)

    const sourceContent = fs.readFileSync(source, 'utf8')
    const destinationContent = fs.readFileSync(destination, 'utf8')
    expect(sourceContent).toEqual(destinationContent)

    exec({ command: `rm ${destination}` })
  })

  test('exec - should run command', async () => {
    const result = await exec({ command: 'ls', errorMessage: 'Error message' })
    expect(result.stdout).not.toStrictEqual('')
  })

  test('exec - should throws with invalid command', async () => {
    await exec({ command: `which ${Date.now()}`, errorMessage: 'Error message' }).catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('spawn - should run command', async () => {
    await spawn({ command: 'ls', errorMessage: 'Error message' }).catch(() => {})
    expect(mockExit).not.toHaveBeenCalled()
  })

  test('spawn - should throw with invalid command', async () => {
    await spawn({ command: `which ${Date.now()}`, errorMessage: 'Error message' }).catch(() => {})
    expect(mockExit).toHaveBeenCalled()
  })

  test('parseArgs - should throw with invalid args', async () => {
    const originalArgs = ['--lang=en']

    try { parseArgs(originalArgs) } catch (error) {}

    expect(mockExit).toHaveBeenCalled()
  })

  test('parseArgs - should parse valid args', async () => {
    const originalArgs = ['--config=../config.json']

    parseArgs(originalArgs)
    expect(mockExit).not.toHaveBeenCalled()
  })

  test('formatTime - should handle zero seconds', () => {
    const time = 0
    expect(formatTime(time)).toBe('0 seconds')
  })

  test('formatTime - should handle time less than a minute', () => {
    const time = 30000 // 30 seconds
    expect(formatTime(time)).toBe('30 seconds')
  })

  test('formatTime - should handle exactly one minute', () => {
    const time = 60000 // 60 seconds
    expect(formatTime(time)).toBe('1 minute')
  })

  test('formatTime - should handle more than a minute', () => {
    const time = 90000 // 1 minute and 30 seconds
    expect(formatTime(time)).toBe('1 minute and 30 seconds')
  })

  test('formatTime - should handle multiple minutes and no seconds', () => {
    const time = 120000 // 2 minutes
    expect(formatTime(time)).toBe('2 minutes')
  })

  test('formatTime - should handle multiple minutes and seconds', () => {
    const time = 150000 // 2 minutes and 30 seconds
    expect(formatTime(time)).toBe('2 minutes and 30 seconds')
  })

  test('formatTime - should round down time correctly', () => {
    const time = 125000 // 2 minutes and 5 seconds
    expect(formatTime(time)).toBe('2 minutes and 5 seconds')
  })

  test('formatTime - should round up time correctly', () => {
    const time = 500 // 0.5 seconds, rounds up to 1 seconds
    expect(formatTime(time)).toBe('1 second')
  })
})
