module.exports = {
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['__template'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  testRegex: '.(test|spec).(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // testMatch: ['**/__test{s,}__/*.(spec|test).{t,j}s{x,}'],
  setupTestFrameworkScriptFile: '<rootDir>/scripts/test-setup.js'
}
