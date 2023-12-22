import nextJest from 'next/jest.js'

const config = {
  testEnvironment: 'node',
  globalSetup: './src/layers/repository/mariadb/test/jest.setup.ts',
  moduleNameMapper: {
    '^@/(.*)$': './src/$1',
  },
}

const createJestConfig = nextJest({
  dir: './',
})(config)

module.exports = async () => {
  const jestConfig = await createJestConfig()

  const moduleNameMapper = {
    ...jestConfig.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
  }

  return { ...jestConfig, moduleNameMapper }
}
