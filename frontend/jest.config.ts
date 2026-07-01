import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

// see https://nextjs.org/docs/app/guides/testing/jest
const config: Config = {
  testEnvironment: 'jsdom',
  testRegex: '.*\\.spec\\.tsx?$',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  /**
   * - next/jest resolves the "@/" alias for regular imports
   * - but for jest.mock('@/...') we still need to define "moduleNameMapper"
   * 
   * so similar thing to backend I did in "jest.config.ts"
   * see https://stackoverflow.com/questions/62691998/jest-test-with-typescript-does-not-recognize-import-alias/62710551#62710551
   */
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  /**
   * below option is needed to avoid the following error in --watch mode
   * "Error: EMFILE: too many open files, watch"
   * see https://stackoverflow.com/questions/33589810/react-native-jest-emfile-too-many-open-files-error
   */
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
}

export default createJestConfig(config)
