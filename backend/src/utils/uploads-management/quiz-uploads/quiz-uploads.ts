import { ForbiddenException } from '@nestjs/common'
import { Prisma } from '@/generated/prisma/client'
import { parseUploadedFileUrl } from '@/utils/uploads-management/uploads-url'

// only the "quizzes" bucket uploads are access protected (avatars in "profiles" are public)
const QUIZZES_BUCKET = 'quizzes'

/**
 * the part of a quiz "questions" json we care about here
 * is the image urls (of 'question-cards' type) only
 */
export type QuestionsWithAnswerImages = { answers?: { imageUrl?: string | null }[] }[]

/**
 * the part of a quiz I need here is the image urls:
 *  - the cover image "imageUrl"
 *  - the "question-cards" answers "imageUrl"
 */
type QuizWithImages = {
  imageUrl?: string | null
  questions?: QuestionsWithAnswerImages | null
}

/**
 * collects all answer image urls found in a quiz "questions" json
 * (btw only "question-cards" answers have an imageUrl)
 */
export function collectAnswerImageUrls(questions?: QuestionsWithAnswerImages | null): Set<string> {
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
 * collects the images filenames (of "quizzes" bucket) referenced by a quiz
 * (its cover image and every card answer image)
 *
 * "/public" sample images and non "/uploads" values are ignored
 */
export function collectQuizUploadFileNames(quiz: QuizWithImages): string[] {
  const urls: (string | null | undefined)[] = [quiz.imageUrl, ...collectAnswerImageUrls(quiz.questions)]

  const fileNames = new Set<string>()

  for (const url of urls) {
    const parsed = parseUploadedFileUrl(url)

    if (parsed && parsed.bucketName === QUIZZES_BUCKET) {
      fileNames.add(parsed.fileName)
    }
  }

  return [...fileNames]
}

/**
 * links the quiz's uploads to it (i.e. sets their "quizId")
 *
 * it first makes sure every referenced upload was uploaded by this user and
 * isn't already owned by a different quiz (otherwise it throws) this is to
 * prevents a user from referencing someone else's image (or an image already
 * set by another quiz) to gain access to it (in summary: this prevents a
 * security vulnerability)
 */
export async function attachQuizUploadsOrThrow(
  tx: Prisma.TransactionClient,
  quizId: number,
  ownerId: number,
  quiz: QuizWithImages,
): Promise<void> {
  const fileNames = collectQuizUploadFileNames(quiz)

  if (fileNames.length === 0) {
    return
  }

  // uploads that this user owns and that are free (unlinked) or already this quiz's
  const eligible = await tx.quizUpload.findMany({
    where: {
      bucket: QUIZZES_BUCKET,
      fileName: { in: fileNames },
      ownerId,
      OR: [{ quizId: null }, { quizId }],
    },
    select: { fileName: true },
  })

  if (eligible.length !== fileNames.length) {
    throw new ForbiddenException('some quiz images were not uploaded by you (or belong to another quiz)')
  }

  await tx.quizUpload.updateMany({
    where: { bucket: QUIZZES_BUCKET, fileName: { in: fileNames } },
    data: { quizId },
  })
}

/**
 * deletes the upload rows of a quiz whose image is no longer referenced
 * (the matching files on disk are removed separately via "uploads-fs.ts")
 *
 * "keepQuiz" should be the full current quiz state so partial updates don't
 * accidentally prune images that weren't part of the update payload
 */
export async function pruneUnreferencedQuizUploads(
  tx: Prisma.TransactionClient,
  quizId: number,
  keepQuiz: QuizWithImages,
): Promise<void> {
  const keptFileNames = collectQuizUploadFileNames(keepQuiz)

  await tx.quizUpload.deleteMany({
    where: {
      bucket: QUIZZES_BUCKET,
      quizId,
      // when nothing is kept I drop every row of this quiz (i.e. "notIn: []" no need for it in this case)
      ...(keptFileNames.length > 0 ? { fileName: { notIn: keptFileNames } } : {}),
    },
  })
}
