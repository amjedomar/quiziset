import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  /**
   * "cookie" npm package is an ESM package only
   * so it must be transpiled like our own source code
   * instead of being skipped as node_modules usually are
   * 
   * please see https://stackoverflow.com/questions/49263429/jest-gives-an-error-syntaxerror-unexpected-token-export
   */
  transformIgnorePatterns: ['node_modules/(?!(cookie)/)'],
  moduleNameMapper: {
    /**
     * maps the "@/" path alias (defined in tsconfig) so jest can resolve "@/..." imports
     * see https://stackoverflow.com/questions/62691998/jest-test-with-typescript-does-not-recognize-import-alias/62710551#62710551
     */
    '^@/(.*)$': '<rootDir>/src/$1',
    /**
     * Fixes `Cannot find module './internal/class.js' from 'generated/prisma/client.ts'` error
     * see https://github.com/prisma/prisma/issues/28335#issuecomment-3931878165
     */
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  /**
   * "collectCoverageFrom" / "coverageDirectory"
   *   - are only used when coverage is collected (i.e. "npm run test:cov" / "jest --coverage")
   *   - it does nothing for the plain "npm test" command
   * 
   * set it to the app "src" directory (and ignore prisma generated files)
   */
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/generated/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
}

export default config
