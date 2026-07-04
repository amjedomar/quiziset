import { join } from 'path'
import { checkFileExists } from './check-file-exists'

describe('checkFileExists', () => {
  it('returns true when the file exists', async () => {
    expect(await checkFileExists(__filename)).toBe(true)
  })

  it('returns false when the file does not exist', async () => {
    expect(await checkFileExists(join(__dirname, 'non-exist-file.txt'))).toBe(false)
  })
})
