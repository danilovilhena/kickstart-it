import { describe, expect, test } from '@jest/globals'
import {
  config,
  originalConfig,
  setOriginalConfig,
  setPartialConfig,
  setFullConfig
} from '../../src/helpers/globals.js'

describe('globals', () => {
  test('should set originalConfig', () => {
    setOriginalConfig({ a: 1 })
    expect(originalConfig).toStrictEqual({ a: 1 })
  })

  test('should set partial config', () => {
    config.a = 1
    setPartialConfig({ b: 2 })
    expect(config).toStrictEqual({ a: 1, b: 2 })
  })

  test('should set full config', () => {
    config.a = 1
    setFullConfig({ b: 2 })
    expect(config).not.toHaveProperty('a')
  })
})
