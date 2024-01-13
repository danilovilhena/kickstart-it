/** @type {import('jest').Config} */
const config = {
  verbose: true,
  silent: false,
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
  transform: {},
  testEnvironment: 'node'
}

export default config
