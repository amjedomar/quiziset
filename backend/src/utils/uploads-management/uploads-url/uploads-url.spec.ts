import { parseUploadedFileUrl } from './uploads-url'

describe('parseUploadedFileUrl', () => {
  it('parses an /uploads url into its bucket and file name', () => {
    expect(parseUploadedFileUrl('/uploads/quizzes/pic.png')).toEqual({ bucketName: 'quizzes', fileName: 'pic.png' })
  })

  it('returns null for /public and null/undefined urls', () => {
    expect(parseUploadedFileUrl('/public/images/quizzes/sample.jpg')).toBeNull()
    expect(parseUploadedFileUrl(null)).toBeNull()
    expect(parseUploadedFileUrl(undefined)).toBeNull()
    expect(parseUploadedFileUrl('/uploads/quizzes')).toBeNull()
  })
})
