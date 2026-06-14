/* eslint-disable @typescript-eslint/no-require-imports */

const { readdirSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const API_CLIENT_DIR = join(__dirname, '../src/api-client')

const files = readdirSync(API_CLIENT_DIR).filter((f) => f.endsWith('.ts'))

for (const file of files) {
  const filePath = join(API_CLIENT_DIR, file)
  const original = readFileSync(filePath, 'utf8')

  // Remove `: Promise<xxxResponse>` return type from async functions
  // So we can control the returned type in our "orval-custom-fetch" file
  const fixed = original.replace(/\): Promise<[a-z]\w*Response> =>/g, ') =>')

  if (fixed !== original) {
    writeFileSync(filePath, fixed)
  }
}
