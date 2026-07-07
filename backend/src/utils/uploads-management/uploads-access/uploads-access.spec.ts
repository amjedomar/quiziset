import { canViewQuizUpload } from './uploads-access'

const OWNER_ID = 7
const OTHER_USER_ID = 99

describe('canViewQuizUpload', () => {
  let prisma: any

  beforeEach(() => {
    prisma = { quizUpload: { findUnique: jest.fn() } }
  })

  it('returns false when there is no upload row', async () => {
    prisma.quizUpload.findUnique.mockResolvedValue(null)

    expect(await canViewQuizUpload(prisma, 'pic.png', OWNER_ID)).toBe(false)
  })

  it('lets the owner view their own upload (even when not attached to a quiz)', async () => {
    prisma.quizUpload.findUnique.mockResolvedValue({ ownerId: OWNER_ID, quiz: null })

    expect(await canViewQuizUpload(prisma, 'pic.png', OWNER_ID)).toBe(true)
  })

  it('lets anyone view an image of a public quiz', async () => {
    prisma.quizUpload.findUnique.mockResolvedValue({ ownerId: OWNER_ID, quiz: { isPublic: true } })

    expect(await canViewQuizUpload(prisma, 'pic.png', OTHER_USER_ID)).toBe(true)

    expect(await canViewQuizUpload(prisma, 'pic.png', undefined)).toBe(true) // even an anonymous user
  })

  it('denies a non-owner viewing a private quiz image', async () => {
    prisma.quizUpload.findUnique.mockResolvedValue({ ownerId: OWNER_ID, quiz: { isPublic: false } })

    expect(await canViewQuizUpload(prisma, 'pic.png', OTHER_USER_ID)).toBe(false)
  })

  it('denies an anonymous user viewing an unattached upload', async () => {
    prisma.quizUpload.findUnique.mockResolvedValue({ ownerId: OWNER_ID, quiz: null })

    expect(await canViewQuizUpload(prisma, 'pic.png', undefined)).toBe(false)
  })
})
