'use client'

import { Box, Button, Sheet, Stack, Typography } from '@mui/joy'
import { useGetAllQuizzes } from '@/api-client/quiz'
import { GetAllQuizzesParams } from '@/api-client/model'
import { isErrorResponse } from '@/utils/is-error-response'
import styles from './quizzes-list.module.scss'
import QuizIcon from '@mui/icons-material/Quiz'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Loading } from '@/components/loading'
import { BackendImage } from '@/ui/backend-image'
import { FavoriteButton } from '@/components/quiz/favorite-button'

interface QuizzesListProps {
  params?: GetAllQuizzesParams
  emptyInfo?: ReactNode
}

export function QuizzesList({ params, emptyInfo }: QuizzesListProps) {
  const { data, isLoading } = useGetAllQuizzes(params)

  const responseBody = data?.data

  if (isErrorResponse(responseBody)) {
    return <p>Error {responseBody.message}</p>
  }

  const quizzes = responseBody?.data

  return (
    <Stack spacing={3}>
      {isLoading ? (
        <Loading />
      ) : quizzes && quizzes.length === 0 ? (
        (emptyInfo ?? <Typography textColor="text.tertiary">No quizzes found</Typography>)
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
          }}
        >
          {quizzes?.map((quiz) => (
            <Sheet
              key={quiz.id}
              component={Link}
              variant="outlined"
              className={styles.quizCard}
              href={`/quizzes/${quiz.id}/overview`}
            >
              <BackendImage className={styles.image} src={quiz.imageUrl} alt="" />

              <div className={styles.details}>
                <Typography level="title-lg">{quiz.title}</Typography>
                <Typography level="body-sm" textColor="text.tertiary" className={styles.quizDescription}>
                  {quiz.description}
                </Typography>
              </div>

              <div className={styles.footer}>
                <Button variant="solid" startDecorator={<QuizIcon />}>
                  View
                </Button>

                <FavoriteButton quizId={quiz.id} isFavorite={!!quiz.isFavorite} />
              </div>
            </Sheet>
          ))}
        </Box>
      )}
    </Stack>
  )
}
