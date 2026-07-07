import { ForbiddenException } from '@nestjs/common'
import {
  attachQuizUploadsOrThrow,
  collectAnswerImageUrls,
  collectQuizUploadFileNames,
  pruneUnreferencedQuizUploads,
} from './quiz-uploads'
import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'
import { makeQuizRecord, QUIZ_ID, USER_ID } from '@/test-utils/mocks'

const OWNER_ID = USER_ID

function makeTx(): any {
  const result = {
    quizUpload: {
      findMany: jest.fn().mockResolvedValue([]),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  }

  // return type as "any" since this is only a partial mock of
  // "Prisma.TransactionClient" interface (we only need "upload")
  // it is needed to avoid TS errors
  return result as any
}

describe('collectAnswerImageUrls', () => {
  it('collects the image urls of every answer across all questions', () => {
    const questions = [
      { answers: [{ imageUrl: '/uploads/quizzes/a.png' }, { imageUrl: '/uploads/quizzes/b.png' }] },
      { answers: [{ imageUrl: '/uploads/quizzes/c.png' }] },
    ]

    expect(collectAnswerImageUrls(questions)).toEqual(
      new Set(['/uploads/quizzes/a.png', '/uploads/quizzes/b.png', '/uploads/quizzes/c.png']),
    )
  })

  it('skips answers without an imageUrl', () => {
    const questions = [{ answers: [{ imageUrl: '/uploads/quizzes/a.png' }, { text: 'no image' }, { imageUrl: null }] }]

    expect(collectAnswerImageUrls(questions)).toEqual(new Set(['/uploads/quizzes/a.png']))
  })

  it('avoids duplicated urls (returns a Set)', () => {
    const questions = [
      { answers: [{ imageUrl: '/uploads/quizzes/same.png' }] },
      { answers: [{ imageUrl: '/uploads/quizzes/same.png' }] },
    ]

    expect(collectAnswerImageUrls(questions)).toEqual(new Set(['/uploads/quizzes/same.png']))
  })

  it('returns an empty Set for undefined/null', () => {
    expect(collectAnswerImageUrls(undefined)).toEqual(new Set())
    expect(collectAnswerImageUrls(null)).toEqual(new Set())
  })
})

describe('collectQuizUploadFileNames', () => {
  it('collects the cover and card answer file names from the quizzes bucket', () => {
    const quiz = makeQuizRecord({
      imageUrl: '/uploads/quizzes/cover.png',
      questions: [
        {
          title: 'pick the right images',
          questionType: QuestionType.Cards,
          answers: [
            { text: 'a', imageUrl: '/uploads/quizzes/a.png' },
            { text: 'b', imageUrl: '/uploads/quizzes/b.png' },
          ],
        },
        {
          title: 'no image question',
          questionType: QuestionType.Radio,
          answers: [
            { text: 'yes', isCorrect: true },
            { text: 'no', isCorrect: false },
          ],
        },
      ],
    })

    expect(collectQuizUploadFileNames(quiz)).toEqual(['cover.png', 'a.png', 'b.png'])
  })

  it('ignores /public sample images and answers without an imageUrl', () => {
    const quiz = makeQuizRecord({
      imageUrl: '/public/images/quizzes/sample.jpg',
      questions: [
        {
          title: 'pick the right image',
          questionType: QuestionType.Cards,
          answers: [{ text: 'a', imageUrl: '/uploads/quizzes/a.png' }, { text: 'b' }],
        },
      ],
    })

    expect(collectQuizUploadFileNames(quiz)).toEqual(['a.png'])
  })

  it('avoids repeated file names', () => {
    const quiz = makeQuizRecord({
      imageUrl: '/uploads/quizzes/same.png',
      questions: [
        {
          title: 'pick the right image',
          questionType: QuestionType.Cards,
          answers: [
            { text: 'a', imageUrl: '/uploads/quizzes/same.png' },
            { text: 'b', imageUrl: '/uploads/quizzes/same.png' },
          ],
        },
      ],
    })

    expect(collectQuizUploadFileNames(quiz)).toEqual(['same.png'])
  })
})

describe('attachQuizUploadsOrThrow', () => {
  it('does nothing when the quiz references no quizzes uploads', async () => {
    const tx = makeTx()

    await attachQuizUploadsOrThrow(tx, QUIZ_ID, OWNER_ID, { imageUrl: '/public/sample.jpg' })

    expect(tx.quizUpload.findMany).not.toHaveBeenCalled()
    expect(tx.quizUpload.updateMany).not.toHaveBeenCalled()
  })

  it('links the referenced uploads to the quiz when the user owns them all', async () => {
    const tx = makeTx()
    tx.quizUpload.findMany.mockResolvedValue([{ fileName: 'cover.png' }])

    await attachQuizUploadsOrThrow(tx, QUIZ_ID, OWNER_ID, { imageUrl: '/uploads/quizzes/cover.png' })

    expect(tx.quizUpload.findMany).toHaveBeenCalledWith({
      where: {
        bucket: 'quizzes',
        fileName: { in: ['cover.png'] },
        ownerId: OWNER_ID,
        OR: [{ quizId: null }, { quizId: QUIZ_ID }],
      },
      select: { fileName: true },
    })
    expect(tx.quizUpload.updateMany).toHaveBeenCalledWith({
      where: { bucket: 'quizzes', fileName: { in: ['cover.png'] } },
      data: { quizId: QUIZ_ID },
    })
  })

  it('throws when a referenced upload is not the user own (or belongs to another quiz)', async () => {
    const tx = makeTx()
    // only one of the two referenced files is eligible
    tx.quizUpload.findMany.mockResolvedValue([{ fileName: 'cover.png' }])

    const quiz = {
      imageUrl: '/uploads/quizzes/cover.png',
      questions: [{ answers: [{ imageUrl: '/uploads/quizzes/not-mine.png' }] }],
    }

    await expect(attachQuizUploadsOrThrow(tx, QUIZ_ID, OWNER_ID, quiz)).rejects.toThrow(ForbiddenException)
    expect(tx.quizUpload.updateMany).not.toHaveBeenCalled()
  })
})

describe('pruneUnreferencedQuizUploads', () => {
  it('deletes the rows of images the quiz no longer references', async () => {
    const tx = makeTx()

    await pruneUnreferencedQuizUploads(tx, QUIZ_ID, { imageUrl: '/uploads/quizzes/cover.png' })

    expect(tx.quizUpload.deleteMany).toHaveBeenCalledWith({
      where: { bucket: 'quizzes', quizId: QUIZ_ID, fileName: { notIn: ['cover.png'] } },
    })
  })

  it('deletes every row of the quiz when it references no quizzes uploads', async () => {
    const tx = makeTx()

    await pruneUnreferencedQuizUploads(tx, QUIZ_ID, { imageUrl: '/public/sample.jpg' })

    expect(tx.quizUpload.deleteMany).toHaveBeenCalledWith({
      where: { bucket: 'quizzes', quizId: QUIZ_ID },
    })
  })
})
