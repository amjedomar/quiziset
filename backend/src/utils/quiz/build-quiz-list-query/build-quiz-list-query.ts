import { Prisma } from '@/generated/prisma/client'
import { GetAllQuizzesQueryDto, QuizSortBy, SortOrder } from '@/modules/quiz/dto/get-all-quizzes-query.dto'

export const QUIZZES_PAGE_SIZE = 12

const SORT_FIELD_BY_OPTION: Record<QuizSortBy, keyof Prisma.QuizOrderByWithRelationInput> = {
  [QuizSortBy.Date]: 'createdAt',
  [QuizSortBy.Rating]: 'averageRating',
  [QuizSortBy.Popularity]: 'totalFinishes',
  [QuizSortBy.Name]: 'title',
}

export interface QuizListQueryArgs {
  searchWhere: Prisma.QuizWhereInput
  orderBy: Prisma.QuizOrderByWithRelationInput
  skip: number
  take: number
}

export function buildQuizListQuery(query: GetAllQuizzesQueryDto): QuizListQueryArgs {
  const page = query.page ?? 1
  const sortField = SORT_FIELD_BY_OPTION[query.sortBy ?? QuizSortBy.Date]
  const order = query.sortOrder ?? SortOrder.Desc

  return {
    searchWhere: query.search ? { title: { contains: query.search } } : {},
    orderBy: { [sortField]: order },
    skip: (page - 1) * QUIZZES_PAGE_SIZE,
    take: QUIZZES_PAGE_SIZE,
  }
}
