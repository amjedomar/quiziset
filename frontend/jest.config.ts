import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

// see https://nextjs.org/docs/app/guides/testing/jest
const config: Config = {
  testEnvironment: 'jsdom',
  testRegex: '.*\\.spec\\.tsx?$',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  /**
   * below option is needed to avoid the following error in --watch mode
   * "Error: EMFILE: too many open files, watch"
   * see https://stackoverflow.com/questions/33589810/react-native-jest-emfile-too-many-open-files-error
   */
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
}

export default createJestConfig(config)
