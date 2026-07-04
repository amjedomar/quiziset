import { UnprocessableEntityException } from '@nestjs/common'
import { mkdir, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { checkFileExists } from '@/utils/check-file-exists'

const UPLOADS_DIR = join(process.cwd(), 'uploads')

/**
 * the part of a quiz "questions" json we care about here
 * is the image urls (of 'question-cards' type) only
 */
type QuestionsWithAnswerImages = { answers?: { imageUrl?: string | null }[] }[]

/**
 * creates the bucket directory (if it doesn't already exist) then saves the file inside it
 * returns the generated fileName (with a random name while keeping the original extension)
 */
export async function createUploadedFile(bucketName: string, buffer: Buffer, ext: string): Promise<string> {
  const bucketDir = join(UPLOADS_DIR, bucketName)

  if (!(await checkFileExists(bucketDir))) {
    await mkdir(bucketDir)
  }

  const fileName = `${randomUUID()}${ext}`
  await writeFile(join(bucketDir, fileName), buffer)

  return fileName
}

/**
 * returns the absolute path of an uploaded file or null if it doesn't exist
 */
export async function getUploadedFilePath(bucketName: string, fileName: string): Promise<string | null> {
  const filePath = join(UPLOADS_DIR, bucketName, fileName)

  return (await checkFileExists(filePath)) ? filePath : null
}

function isSafeFilename(filename: string) {
  // security-check: `filename` must be a plain name (path separators aren't allowed
  // to prevent access to other files in the server system via '..')

  return !filename.includes('/') && !filename.includes('\\') && !filename.includes('..')
}

/**
 * deletes a single uploaded file from disk
 * btw in case file doesn't exist then NO error is thrown
 */
export async function deleteUploadedFile(bucketName: string, fileName: string): Promise<void> {
  if (!isSafeFilename(fileName)) {
    throw new UnprocessableEntityException('invalid fileName')
  }

  const filePath = join(UPLOADS_DIR, bucketName, fileName)

  if (await checkFileExists(filePath)) {
    await unlink(filePath)
  }
}

/**
 * this function accepts the file relative url as input
 * then it deletes the corresponding file on the disk system
 *
 * only match files that starts with "/uploads"
 * however "/public" files are kept (not removed) as they are sample files
 */
export async function deleteUploadedFileByUrl(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith('/uploads/')) {
    return
  }

  // the url schema is /uploads/{bucketName}/{fileName}
  const [bucketName, fileName] = url.split('/').slice(2)

  if (!bucketName || !fileName) {
    return
  }

  await deleteUploadedFile(bucketName, fileName)
}

/**
 * deletes multiple uploaded files (by their urls)
 */
export async function deleteUploadedFilesByUrls(urls: Iterable<string>): Promise<void> {
  await Promise.all([...urls].map((url) => deleteUploadedFileByUrl(url)))
}

/**
 * collects all answer image urls found in a quiz "questions" json
 * (btw only "question-cards" answers have an imageUrl)
 */
function collectAnswerImageUrls(questions?: QuestionsWithAnswerImages): Set<string> {
  const urls = new Set<string>()

  if (!Array.isArray(questions)) {
    return urls
  }

  for (const question of questions) {
    for (const answer of question.answers ?? []) {
      if (answer.imageUrl) {
        urls.add(answer.imageUrl)
      }
    }
  }

  return urls
}

/**
 * deletes the quiz old image files that have been replaced:
 * which can be
 *  - the quiz cover image
 *  - the "question-cards" answer images
 *
 * btw the "newly uploaded then removed" (before saving) case is handled on the
 * frontend instead via the delete file endpoint
 *
 * note: /public images are always kept (as explained in deleteUploadedFileByUrl)
 */
export async function deleteReplacedQuizImageFiles(
  previousQuiz: { imageUrl: string; questions?: QuestionsWithAnswerImages },
  update: { imageUrl?: string; questions?: QuestionsWithAnswerImages },
): Promise<void> {
  if (update.imageUrl !== undefined && update.imageUrl !== previousQuiz.imageUrl) {
    await deleteUploadedFileByUrl(previousQuiz.imageUrl)
  }

  // only when "questions" is part of the update
  if (update.questions) {
    const oldImageUrls = collectAnswerImageUrls(previousQuiz.questions)
    const newImageUrls = collectAnswerImageUrls(update.questions)

    const removedImageUrls = [...oldImageUrls].filter((url) => !newImageUrls.has(url))

    await deleteUploadedFilesByUrls(removedImageUrls)
  }
}

/**
 * deletes all image files of a quiz (its cover image and every card answer image)
 *
 * this function is used when a quiz is deleted
 */
export async function deleteAllQuizImageFiles(quiz: {
  imageUrl: string
  questions?: QuestionsWithAnswerImages
}): Promise<void> {
  await deleteUploadedFileByUrl(quiz.imageUrl)
  await deleteUploadedFilesByUrls(collectAnswerImageUrls(quiz.questions))
}
