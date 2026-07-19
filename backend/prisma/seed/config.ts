import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'
import { getQuizSampleImagePath } from '@/utils/sample-images'

const { SEED_DUMMY_USER_EMAIL, SEED_DUMMY_USER_PASSWORD } = process.env

if (!SEED_DUMMY_USER_EMAIL) {
  throw new Error('Please define `SEED_DUMMY_USER_EMAIL` in backend/.env')
}

if (!SEED_DUMMY_USER_PASSWORD) {
  throw new Error('Please define `SEED_DUMMY_USER_PASSWORD` in backend/.env')
}

// to simplify things the 7 created test users will have the same password
export const TEST_USER_PASSWORD = SEED_DUMMY_USER_PASSWORD

// 7 users (avatars exists under src/public/images/avatars)
export const TEST_USERS = [
  // This is the main dummy user account (that owns all the quizzes)
  { name: 'Amjed Omar', email: SEED_DUMMY_USER_EMAIL, avatar: 'avatar1' },

  // rest accounts are only needed for reviews / totalFinishes / quiz analytics records
  { name: 'Daniel', email: 'daniel@quiziset.local', avatar: 'avatar2' },
  { name: 'Amir', email: 'amir@quiziset.local', avatar: 'avatar3' },
  { name: 'Sara', email: 'sara@quiziset.local', avatar: 'avatar4' },
  { name: 'Nadia', email: 'nadia@quiziset.local', avatar: 'avatar5' },
  { name: 'Emma', email: 'emma@quiziset.local', avatar: 'avatar6' },
  { name: 'Nathan', email: 'nathan@quiziset.local', avatar: null },
]

interface QuizSeed {
  name: string
  totalFinishes: number
  reviewRatings: number[]
  isPrivate?: boolean
  isForceAnalyticsEnabled?: boolean
  isOneSessionInProgress?: boolean
}

export const QUIZZES_LIST: QuizSeed[] = [
  { name: 'agriculture', totalFinishes: 0, reviewRatings: [], isPrivate: true },
  { name: 'meteorology', totalFinishes: 22, reviewRatings: [5, 5, 5, 5, 4, 4, 5] },
  { name: 'mountains', totalFinishes: 22, reviewRatings: [2, 3, 3, 2, 2, 2, 2] },
  { name: 'business', totalFinishes: 13, reviewRatings: [4, 3, 3, 4, 4, 4, 4] },
  { name: 'english', totalFinishes: 17, reviewRatings: [3, 3, 3, 3, 3, 4, 3] },
  { name: 'robotics', totalFinishes: 13, reviewRatings: [4, 4, 4, 4, 3, 3, 3] },
  { name: 'architecture', totalFinishes: 15, reviewRatings: [3, 4, 4, 3, 3, 3, 3] },
  { name: 'history', totalFinishes: 30, reviewRatings: [5, 4, 4, 4, 4, 5, 5] },
  { name: 'economics', totalFinishes: 27, reviewRatings: [2, 1, 1, 2, 2, 2, 2] },
  { name: 'statistics', totalFinishes: 37, reviewRatings: [4, 5, 4, 3, 5, 4, 3] },
  { name: 'art', totalFinishes: 14, reviewRatings: [3, 3, 3, 3, 4, 4, 4] },
  { name: 'chemistry', totalFinishes: 40, reviewRatings: [5, 4, 4, 3, 5, 4, 3] },
  { name: 'biology', totalFinishes: 39, reviewRatings: [4, 4, 4, 5, 4, 4, 4] },
  { name: 'geology', totalFinishes: 37, reviewRatings: [4, 4, 3, 4, 4, 4, 4] },
  { name: 'technology', totalFinishes: 34, reviewRatings: [4, 4, 4, 4, 4, 4, 4], isOneSessionInProgress: true },
  { name: 'literature', totalFinishes: 34, reviewRatings: [4, 4, 4, 4, 5, 5, 4], isForceAnalyticsEnabled: true },
  { name: 'space', totalFinishes: 33, reviewRatings: [5, 5, 4, 4, 4, 4, 4] },
  { name: 'law', totalFinishes: 35, reviewRatings: [4, 5, 4, 4, 4, 4, 4] },
  { name: 'math', totalFinishes: 38, reviewRatings: [4, 4, 4, 4, 4, 4, 4] },
  { name: 'travel', totalFinishes: 16, reviewRatings: [1, 2, 2, 1, 1, 1, 1] },
  { name: 'football', totalFinishes: 28, reviewRatings: [1, 1, 1, 1, 2, 2, 2] },
  { name: 'health', totalFinishes: 27, reviewRatings: [2, 2, 2, 2, 1, 1, 1] },
  { name: 'electronics', totalFinishes: 31, reviewRatings: [5, 5, 4, 5, 5, 5, 5] },
  { name: 'geography', totalFinishes: 31, reviewRatings: [4, 4, 5, 5, 5, 5, 4] },
  { name: 'cinema', totalFinishes: 25, reviewRatings: [2, 2, 2, 2, 2, 1, 2] },
  { name: 'music', totalFinishes: 24, reviewRatings: [4, 4, 5, 5, 4, 4, 4] },
  { name: 'nature', totalFinishes: 18, reviewRatings: [3, 3, 3, 3, 3, 3, 3] },
  { name: 'oceans', totalFinishes: 19, reviewRatings: [2, 2, 2, 2, 3, 3, 3] },
  { name: 'computers', totalFinishes: 19, reviewRatings: [3, 3, 3, 3, 2, 2, 2] },
  { name: 'food', totalFinishes: 19, reviewRatings: [3, 2, 2, 3, 3, 3, 3] },
  { name: 'energy', totalFinishes: 18, reviewRatings: [3, 3, 3, 3, 3, 2, 3] },
]

// to keep things simple every quiz have the same 4 questions
export const QUIZ_QUESTIONS: PrismaJson.QuizQuestions = [
  {
    title: 'Checkbox question',
    questionType: QuestionType.Checkbox,
    answers: [
      { text: 'Answer 1 (correct)', isCorrect: true },
      { text: 'Answer 2 (correct)', isCorrect: true },
      { text: 'Answer 3', isCorrect: false },
      { text: 'Answer 4', isCorrect: false },
      { text: 'Answer 5', isCorrect: false },
    ],
  },
  {
    title: 'Radio question',
    questionType: QuestionType.Radio,
    answers: [
      { text: 'Answer 1 (correct)', isCorrect: true },
      { text: 'Answer 2', isCorrect: false },
      { text: 'Answer 3', isCorrect: false },
      { text: 'Answer 4', isCorrect: false },
      { text: 'Answer 5', isCorrect: false },
    ],
  },
  {
    title: 'Reorder question',
    questionType: QuestionType.Reorder,
    answers: [{ text: 'Order 1' }, { text: 'Order 2' }, { text: 'Order 3' }, { text: 'Order 4' }, { text: 'Order 5' }],
  },
  {
    title: 'Cards question',
    questionType: QuestionType.Cards,
    answers: [
      { text: 'Answer 1 (correct)', isCorrect: true, imageUrl: getQuizSampleImagePath('english') },
      { text: 'Answer 2', isCorrect: false, imageUrl: getQuizSampleImagePath('nature') },
      { text: 'Answer 3', isCorrect: false, imageUrl: getQuizSampleImagePath('music') },
    ],
  },
]

// the time limit that a quiz may randomly have (null means the quiz has no time limit)
export const TIME_LIMIT_OPTIONS = [null, 5, 15, 30, 45, 60, 75]

export const STAR_COMMENTS: Record<number, string[]> = {
  1: [
    'I did not like it',
    'Quite boring',
    'Not good at all',
    'A bit of a waste of time',
    'Very weak quiz',
    'I would not take it again',
    'Pretty disappointing',
  ],
  2: [
    'A bit weak',
    'Not that fun for me',
    'Kind of boring',
    'It was too easy',
    'Needs more work',
    'I expected more',
    'Not great honestly',
  ],
  3: [
    'It was okay',
    'Not bad overall',
    'Just an average quiz',
    'A decent quiz',
    'Fine but nothing special',
    'It could be better',
    'An ok quiz',
  ],
  4: [
    'Good quiz',
    'I enjoyed it',
    'Nice one',
    'Pretty fun to take',
    'I liked it a lot',
    'Well made quiz',
    'Happy I took it',
  ],
  5: [
    'Great quiz',
    'I really loved it',
    'This was so much fun',
    'One of the best quizzes here',
    'I learned a lot',
    'I would take it again',
    'Excellent quiz',
  ],
}

// the lowest value a quiz can have for createdAt
export const QUIZ_CREATED_BASE = new Date('2026-05-04T09:00:00.000Z')

// every session starts after all quizzes were created so the timeline is reasonable
// same for reviews (createdAt is after the createdAt of sessions)
export const SESSION_CREATED_BASE = new Date('2026-06-10T09:00:00.000Z')
export const REVIEW_CREATED_BASE = new Date('2026-06-23T09:00:00.000Z')

// the favorite quizzes of each user as a hardcoded list of quiz indexes
export const FAVORITE_QUIZ_INDEXES = [
  [0, 2, 4, 7, 11, 15, 20, 28], // amjed
  [1, 3, 9, 12, 18, 25], // daniel
  [0, 5, 6, 14, 21, 27, 29], // amir
  [2, 8, 10, 13, 19, 22], // sara
  [4, 7, 16, 17, 23, 24, 26], // nadia
  [1, 6, 11, 15, 20, 28, 29], // emma
  [3, 5, 9, 13, 18, 25, 27], // nathan
]
