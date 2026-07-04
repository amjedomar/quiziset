import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'
import { getQuizSampleImagePath } from '@/utils/sample-images'

// to simplify things the 7 created test users will have the same password
export const TEST_USER_PASSWORD = 'quiziset789'

// 7 users (avatars exists under src/public/images/avatars)
export const TEST_USERS = [
  { name: 'Amjed Omar', email: 'amjed@example.com', avatar: 'avatar1' },
  { name: 'Daniel', email: 'daniel@example.com', avatar: 'avatar2' },
  { name: 'Amir', email: 'amir@example.com', avatar: 'avatar3' },
  { name: 'Sara', email: 'sara@example.com', avatar: 'avatar4' },
  { name: 'Nadia', email: 'nadia@example.com', avatar: 'avatar5' },
  { name: 'Emma', email: 'emma@example.com', avatar: 'avatar6' },
  { name: 'Nathan', email: 'nathan@example.com', avatar: null },
]

// 30 quizzes
export const QUIZZES_LIST = [
  'chemistry',
  'biology',
  'math',
  'statistics',
  'geology',
  'meteorology',
  'oceans',
  'space',
  'energy',
  'electronics',
  'robotics',
  'computers',
  'technology',
  'health',
  'nature',
  'geography',
  'economics',
  'business',
  'law',
  'history',
  'literature',
  'english',
  'architecture',
  'art',
  'music',
  'food',
  'travel',
  'mountains',
  'football',
  'cinema',
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
      { text: 'Answer 1 (correct)', isCorrect: true, imageUrl: getQuizSampleImagePath('space') },
      { text: 'Answer 2', isCorrect: false, imageUrl: getQuizSampleImagePath('nature') },
      { text: 'Answer 3', isCorrect: false, imageUrl: getQuizSampleImagePath('music') },
    ],
  },
]

// the time limit that a quiz may randomly have (null means the quiz has no time limit)
export const TIME_LIMIT_OPTIONS = [null, 10, 15, 20, 30, 45, 60]

// a list of couple mock review comments & rating stars
export const REVIEWS_LIST = [
  { rating: 5, comment: 'I really liked this quiz' },
  { rating: 4, comment: 'It was fun and not too hard' },
  { rating: 4.5, comment: 'I learned new things' },
  { rating: 3, comment: 'Some questions were hard' },
  { rating: 4.5, comment: 'Nice quiz I might take again in the future' },
  { rating: 5, comment: 'Good questions' },
  { rating: 2, comment: 'It was too easy for me' },
  { rating: 4.5, comment: 'I liked the card questions' },
  { rating: 5, comment: 'This quiz was very fun' },
  { rating: 4, comment: 'I enjoyed it' },
  { rating: 3.5, comment: 'It was good but needs more questions' },
  { rating: 4.5, comment: 'The questions were easy to understand' },
  { rating: 5, comment: 'I want to take more quizzes like this' },
  { rating: 4, comment: 'It was simple and fun' },
  { rating: 5, comment: 'Great quiz for learning' },
]

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
