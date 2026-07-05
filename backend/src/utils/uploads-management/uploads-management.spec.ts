import { mkdir, unlink, writeFile } from 'fs/promises'
import {
  createUploadedFile,
  deleteAllQuizImageFiles,
  deleteReplacedQuizImageFiles,
  deleteUploadedFile,
  deleteUploadedFileByUrl,
  deleteUploadedFilesByUrls,
  getUploadedFilePath,
} from './uploads-management'

jest.mock('fs/promises')

const checkFileExists = jest.fn()
jest.mock('@/utils/check-file-exists', () => ({
  checkFileExists: (...args: unknown[]) => checkFileExists(...args),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createUploadedFile', () => {
  it('creates the bucket directory when missing and writes the file', async () => {
    checkFileExists.mockResolvedValue(false)

    const fileName = await createUploadedFile('quizzes', Buffer.from('image-data'), '.png')

    expect(mkdir).toHaveBeenCalled()
    expect(writeFile).toHaveBeenCalled()
    expect(fileName).toMatch(/^[\w-]+\.png$/)
  })

  it('does not recreate the bucket directory when it already exists', async () => {
    checkFileExists.mockResolvedValue(true)

    await createUploadedFile('quizzes', Buffer.from('image-data'), '.png')

    expect(mkdir).not.toHaveBeenCalled()
  })
})

describe('getUploadedFilePath', () => {
  it('returns the file path when it exists', async () => {
    checkFileExists.mockResolvedValue(true)

    expect(await getUploadedFilePath('quizzes', 'pic.png')).toMatch(/uploads.quizzes.pic\.png$/)
  })

  it('returns null when the file does not exist', async () => {
    checkFileExists.mockResolvedValue(false)

    expect(await getUploadedFilePath('quizzes', 'pic.png')).toBeNull()
  })
})

describe('deleteUploadedFile', () => {
  it('deletes the file when it exists', async () => {
    checkFileExists.mockResolvedValue(true)

    await deleteUploadedFile('quizzes', 'pic.png')

    expect(unlink).toHaveBeenCalled()
  })

  it('does nothing when the file does not exist', async () => {
    checkFileExists.mockResolvedValue(false)

    await deleteUploadedFile('quizzes', 'pic.png')

    expect(unlink).not.toHaveBeenCalled()
  })

  it('throws for a fileName containing path separators', async () => {
    await expect(deleteUploadedFile('quizzes', '../secret.png')).rejects.toThrow('invalid fileName')

    expect(unlink).not.toHaveBeenCalled()
  })
})

describe('deleteUploadedFileByUrl', () => {
  beforeEach(() => {
    checkFileExists.mockResolvedValue(true)
  })

  it('deletes the file matching an /uploads url', async () => {
    await deleteUploadedFileByUrl('/uploads/quizzes/pic.png')

    expect(unlink).toHaveBeenCalled()
  })

  it('ignores a /public url', async () => {
    await deleteUploadedFileByUrl('/public/images/quizzes/sample.jpg')

    expect(unlink).not.toHaveBeenCalled()
  })

  it('ignores a nullish url', async () => {
    await deleteUploadedFileByUrl(undefined)

    expect(unlink).not.toHaveBeenCalled()
  })
})

describe('deleteUploadedFilesByUrls', () => {
  it('deletes every /uploads url given', async () => {
    checkFileExists.mockResolvedValue(true)

    await deleteUploadedFilesByUrls(['/uploads/quizzes/a.png', '/uploads/quizzes/b.png'])

    expect(unlink).toHaveBeenCalledTimes(2)
  })
})

describe('deleteReplacedQuizImageFiles', () => {
  beforeEach(() => {
    checkFileExists.mockResolvedValue(true)
  })

  it('deletes the old cover image when it changed', async () => {
    await deleteReplacedQuizImageFiles(
      { imageUrl: '/uploads/quizzes/old.png' },
      { imageUrl: '/uploads/quizzes/new.png' },
    )

    expect(unlink).toHaveBeenCalledTimes(1)
  })

  it('does not delete the cover image when it did not change', async () => {
    await deleteReplacedQuizImageFiles(
      { imageUrl: '/uploads/quizzes/same.png' },
      { imageUrl: '/uploads/quizzes/same.png' },
    )

    expect(unlink).not.toHaveBeenCalled()
  })

  it('deletes answer image files removed from the questions update', async () => {
    const previousQuiz = {
      imageUrl: '/uploads/quizzes/cover.png',
      questions: [
        {
          answers: [{ imageUrl: '/uploads/quizzes/answer-a.png' }, { imageUrl: '/uploads/quizzes/answer-b.png' }],
        },
      ],
    }
    const update = {
      questions: [{ answers: [{ imageUrl: '/uploads/quizzes/answer-a.png' }] }],
    }

    await deleteReplacedQuizImageFiles(previousQuiz, update)

    expect(unlink).toHaveBeenCalledTimes(1)
  })
})

describe('deleteAllQuizImageFiles', () => {
  it('deletes the cover image and every answer image', async () => {
    checkFileExists.mockResolvedValue(true)

    await deleteAllQuizImageFiles({
      imageUrl: '/uploads/quizzes/cover.png',
      questions: [{ answers: [{ imageUrl: '/uploads/quizzes/answer-a.png' }] }],
    })

    expect(unlink).toHaveBeenCalledTimes(2)
  })
})
