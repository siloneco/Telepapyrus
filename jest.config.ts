import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  testEnvironment: 'node',
  globalTeardown: './src/layers/repository/mariadb/test/jest.teardown.ts',
}

export default createJestConfig(config)
