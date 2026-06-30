import { GetAllQuizzesParams, GetAllQuizzesSortBy, GetAllQuizzesSortOrder } from '@/generated-api-client/model'

export type SortValue =
  | 'most-popular'
  | 'least-popular'
  | 'highest-rating'
  | 'lowest-rating'
  | 'newest'
  | 'oldest'
  | 'name-az'
  | 'name-za'

export interface QuizSortOption {
  value: SortValue
  label: string
  sortBy: GetAllQuizzesSortBy
  sortOrder: GetAllQuizzesSortOrder
}

export const QUIZ_SORT_OPTIONS: QuizSortOption[] = [
  { value: 'most-popular', label: 'Most Popular', sortBy: 'popularity', sortOrder: 'desc' },
  { value: 'least-popular', label: 'Least Popular', sortBy: 'popularity', sortOrder: 'asc' },
  { value: 'highest-rating', label: 'Highest Rating', sortBy: 'rating', sortOrder: 'desc' },
  { value: 'lowest-rating', label: 'Lowest Rating', sortBy: 'rating', sortOrder: 'asc' },
  { value: 'newest', label: 'Newest', sortBy: 'date', sortOrder: 'desc' },
  { value: 'oldest', label: 'Oldest', sortBy: 'date', sortOrder: 'asc' },
  { value: 'name-az', label: 'Name (A-Z)', sortBy: 'name', sortOrder: 'asc' },
  { value: 'name-za', label: 'Name (Z-A)', sortBy: 'name', sortOrder: 'desc' },
]

export function getQuizSortData(value: SortValue): QuizSortOption {
  return QUIZ_SORT_OPTIONS.find((option) => option.value === value)!
}

export function getSortValueFromParams(params?: GetAllQuizzesParams): SortValue | undefined {
  const match = QUIZ_SORT_OPTIONS.find(
    (option) => option.sortBy === params?.sortBy && option.sortOrder === params?.sortOrder,
  )
  return match?.value
}
