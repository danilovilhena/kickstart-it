/** @type {import('jest').Config} */
const config = {
  verbose: true,
  silent: true,
  moduleFileExtensions: [
    'js',
    'json'
  ],
  testMatch: [
    '**/?(*.)+(spec|test|tests).[jt]s?(x)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}'
  ],
  coverageReporters: [
    'text',
    'text-summary',
    'html'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}

export default config
