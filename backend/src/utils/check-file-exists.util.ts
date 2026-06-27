import { access } from 'fs/promises'
import { constants as fsConstants } from 'fs'

/**
 * Code of this function is inspired by https://stackoverflow.com/a/35008327/8148505
 */
export async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}
