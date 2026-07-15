'use client'

import { Stack } from '@mui/joy'
import { GetAllQuizzesParams, QuizEntity } from '@/generated-api-client/model'
import { ReactNode, useEffect, useState } from 'react'
import { ErrorResponseView } from '@/components/error-response-view'
import { Pagination } from '@/ui/pagination'
import { SelectEnhanced } from '@/ui/select-enhanced'
import { useQuizzesQuery } from '@/hooks/use-quizzes-query'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { QUIZ_SORT_OPTIONS, SortValue, getQuizSortData, getSortValueFromParams } from '@/constants/quizzes-list-sort'
import { useSnackbar } from '@/components/snackbar'

interface QuizSortComponentProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface HeaderRenderArgs {
  SortComponent: (props: QuizSortComponentProps) => ReactNode
  totalMatches: number
  onSearch: (value: string) => void
}

interface QuizzesRenderArgs {
  quizzes?: QuizEntity[]
  isLoading: boolean
}

interface QuizzesListProps {
  params?: GetAllQuizzesParams
  renderHeader: (args: HeaderRenderArgs) => ReactNode
  renderQuizzes: (args: QuizzesRenderArgs) => ReactNode
}

export function QuizzesList({ params, renderHeader, renderQuizzes }: QuizzesListProps) {
  const { showError } = useSnackbar()

  const [search, setSearch] = useState('')

  const [sortValue, setSortValue] = useState<SortValue>(() => getSortValueFromParams(params) ?? 'newest')
  const [page, setPage] = useState(() => params?.page ?? 1)

  const debouncedSearch = useDebouncedValue(search, 350)

  useEffect(() => {
    setPage(1) // searching resets to the first page
  }, [debouncedSearch])

  const selectedSort = getQuizSortData(sortValue)

  const effectiveParams: GetAllQuizzesParams = {
    managedByMe: params?.managedByMe,
    favoritedByMe: params?.favoritedByMe,
    page,
    sortBy: selectedSort.sortBy,
    sortOrder: selectedSort.sortOrder,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  }

  const { quizzes, totalMatches, totalPages, isLoading, error } = useQuizzesQuery(effectiveParams)

  useEffect(() => {
    if (error) {
      showError(error.message)
    }
  }, [error, showError])

  function handleSortChange(value: string | null) {
    if (value) {
      setSortValue(value as SortValue)
      setPage(1) // changing the sort also resets to the first page
    }
  }

  const SortComponent = (props: QuizSortComponentProps) => (
    <SelectEnhanced
      value={sortValue}
      multiple={false}
      onChange={(_event, value) => handleSortChange(value)}
      options={QUIZ_SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
      {...props}
    />
  )

  if (error && !quizzes) {
    return <ErrorResponseView error={error} />
  }

  return (
    <>
      {renderHeader({ SortComponent, totalMatches, onSearch: setSearch })}

      <Stack spacing={3}>
        {renderQuizzes({ quizzes, isLoading })}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Stack>
    </>
  )
}
