module.exports = {
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['__template', 'node_modules'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@rcp/(.*)$': '<rootDir>/packages/$1/index'
  },
  // testRegex: '<rootDir>/.(test|spec).(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__test{s,}__/*.(spec|test).{t,j}s{x,}'],
  setupTestFrameworkScriptFile: '<rootDir>/scripts/test-setup.js'
}
