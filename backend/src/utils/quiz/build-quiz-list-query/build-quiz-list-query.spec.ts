import { QuizSortBy, SortOrder } from '@/modules/quiz/dto/get-all-quizzes-query.dto'
import { buildQuizListQuery, QUIZZES_PAGE_SIZE } from './build-quiz-list-query'

describe('buildQuizListQuery', () => {
  it('default is sorting by newest first, page 1, and no search filter', () => {
    expect(buildQuizListQuery({})).toEqual({
      searchWhere: {},
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: QUIZZES_PAGE_SIZE,
    })
  })

  it('filters by the search term when given', () => {
    expect(buildQuizListQuery({ search: 'js basics' })).toEqual({
      searchWhere: { title: { contains: 'js basics' } },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: QUIZZES_PAGE_SIZE,
    })
  })

  it('sorts by the given field and order', () => {
    expect(buildQuizListQuery({ sortBy: QuizSortBy.Rating, sortOrder: SortOrder.Asc })).toEqual({
      searchWhere: {},
      orderBy: { averageRating: 'asc' },
      skip: 0,
      take: QUIZZES_PAGE_SIZE,
    })
  })

  it('paginates using the given page number', () => {
    expect(buildQuizListQuery({ page: 3 })).toEqual({
      searchWhere: {},
      orderBy: { createdAt: 'desc' },
      skip: 2 * QUIZZES_PAGE_SIZE,
      take: QUIZZES_PAGE_SIZE,
    })
  })
})
