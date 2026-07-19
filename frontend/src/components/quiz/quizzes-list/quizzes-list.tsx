'use client'

import { CircularProgress, Input, Stack, Typography } from '@mui/joy'
import clsx from 'clsx'
import SearchIcon from '@mui/icons-material/Search'
import { GetAllQuizzesParams, QuizEntity } from '@/generated-api-client/model'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { ErrorResponseView } from '@/components/error-response-view'
import { Pagination } from '@/ui/pagination'
import { SelectEnhanced } from '@/ui/select-enhanced'
import { useQuizzesQuery } from '@/hooks/use-quizzes-query'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { QUIZ_SORT_OPTIONS, SortValue, getQuizSortData, getSortValueFromParams } from '@/constants/quizzes-list-sort'
import { useSnackbar } from '@/components/snackbar'
import styles from './quizzes-list.module.scss'

interface QuizSearchComponentProps {
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface QuizSortComponentProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface QuizTotalMatchesComponentProps {
  label: { singular: string; plural: string }
  size?: 'sm' | 'md'
  className?: string
}

interface HeaderRenderArgs {
  SearchComponent: (props: QuizSearchComponentProps) => ReactNode
  SortComponent: (props: QuizSortComponentProps) => ReactNode
  TotalMatchesComponent: (props: QuizTotalMatchesComponentProps) => ReactNode
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

  const { quizzes, totalMatches, totalPages, isLoading, isFetchingChangedQuery, error } =
    useQuizzesQuery(effectiveParams)

  useEffect(() => {
    if (error) {
      showError(error.message)
    }
  }, [error, showError])

  const handleSortChange = useCallback((value: string | null) => {
    if (value) {
      setSortValue(value as SortValue)
      setPage(1) // changing the sort also resets to the first page
    }
  }, [])

  const SearchComponent = useCallback(
    (props: QuizSearchComponentProps) => (
      <Input
        variant="outlined"
        startDecorator={<SearchIcon />}
        onChange={(event) => setSearch(event.target.value)}
        {...props}
      />
    ),
    [],
  )

  const SortComponent = useCallback(
    (props: QuizSortComponentProps) => (
      <SelectEnhanced
        value={sortValue}
        multiple={false}
        onChange={(_event, value) => handleSortChange(value)}
        options={QUIZ_SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
        {...props}
      />
    ),
    [sortValue, handleSortChange],
  )

  const TotalMatchesComponent = useCallback(
    ({ label, size = 'sm', className }: QuizTotalMatchesComponentProps) => {
      if (totalMatches === null) {
        return null
      }

      return (
        <div className={clsx(styles.totalMatches, className)}>
          <Typography
            data-testid="total-matches"
            level={size === 'md' ? 'body-md' : 'body-sm'}
            textColor="text.tertiary"
          >
            {totalMatches} total {totalMatches === 1 ? label.singular : label.plural}
          </Typography>

          {isFetchingChangedQuery && <CircularProgress size="sm" />}
        </div>
      )
    },
    [totalMatches, isFetchingChangedQuery],
  )

  if (error && !quizzes) {
    return <ErrorResponseView error={error} />
  }

  return (
    <div>
      {renderHeader({ SearchComponent, SortComponent, TotalMatchesComponent })}

      <Stack sx={{ gap: 3 }}>
        {renderQuizzes({ quizzes, isLoading })}

        <Pagination page={page} totalPages={totalPages ?? 0} onPageChange={setPage} />
      </Stack>
    </div>
  )
}
