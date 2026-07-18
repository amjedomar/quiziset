'use client'

import { useState } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { Alert, Button, Sheet, Typography } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import { useGetQuizAnalytics } from '@/generated-api-client/quiz-analytics'
import { ErrorResponseView } from '@/components/error-response-view'
import { useRetainedQuery } from '@/hooks/use-retained-query'
import { Loading } from '@/components/loading'
import { Pagination } from '@/ui/pagination'
import { SelectEnhanced } from '@/ui/select-enhanced'
import { QuizAnalyticsDesktop } from '@/components/quiz/quiz-analytics/quiz-analytics-desktop'
import { QuizAnalyticsMobile } from '@/components/quiz/quiz-analytics/quiz-analytics-mobile'
import EditIcon from '@mui/icons-material/Edit'
import WarningIcon from '@mui/icons-material/WarningRounded'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import styles from './quiz-analytics.module.scss'

interface QuizAnalyticsProps {
  quizId: number
}

// must match the allowed page sizes on the backend
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]
const DEFAULT_PAGE_SIZE = 20

export function QuizAnalytics({ quizId }: QuizAnalyticsProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const queryResult = useGetQuizAnalytics(quizId, { page, pageSize }, { query: { placeholderData: keepPreviousData } })
  const { data: body, error, isLoading } = useRetainedQuery(queryResult)

  if (isLoading) {
    return <Loading />
  }

  if (!body) {
    // analytics disabled --> show the message with a link to the update quiz page
    if (error?.statusCode === 400) {
      return (
        <Alert color="warning" variant="soft" startDecorator={<WarningIcon />} className={styles.disabledAlert}>
          <div className={styles.disabledContent}>
            <Typography level="title-md">Analytics is disabled</Typography>
            <Typography level="body-sm">{error.message}</Typography>
            <Button
              data-testid="update-quiz-link"
              component={AppLink}
              href={`/manage-quizzes/${quizId}/update`}
              variant="solid"
              color="warning"
              size="sm"
              startDecorator={<EditIcon />}
              className={styles.disabledButton}
            >
              Go to update quiz page
            </Button>
          </div>
        </Alert>
      )
    }

    return <ErrorResponseView error={error} />
  }

  const { data: sessions, totalMatches, totalPages } = body

  function handlePageSizeChange(value: string | null) {
    if (value) {
      setPageSize(Number(value))
      setPage(1) // changing the page size resets to the first page
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          component={AppLink}
          href="/manage-quizzes"
          variant="plain"
          size="sm"
          startDecorator={<ArrowBackIcon />}
          className={styles.backButton}
        >
          Manage Quizzes
        </Button>

        <Typography level="h2">Analytics</Typography>
      </div>

      <div className={styles.toolbar}>
        <Typography textColor="text.tertiary">
          {totalMatches} {totalMatches === 1 ? 'session' : 'sessions'}
        </Typography>

        <SelectEnhanced
          size="md"
          value={String(pageSize)}
          multiple={false}
          onChange={(_event, value) => handlePageSizeChange(value)}
          options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: `${size} per page` }))}
        />
      </div>

      {totalMatches === 0 ? (
        <Sheet variant="soft" className={styles.empty}>
          <Typography level="body-md" textColor="text.tertiary">
            No one has taken this quiz yet
          </Typography>
        </Sheet>
      ) : (
        <>
          <QuizAnalyticsDesktop sessions={sessions} />
          <QuizAnalyticsMobile sessions={sessions} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
