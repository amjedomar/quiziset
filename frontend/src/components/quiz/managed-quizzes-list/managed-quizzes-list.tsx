'use client'
import { Button, CircularProgress, Sheet, Stack, Typography } from '@mui/joy'
import Link from 'next/link'
import { useGetAllQuizzes } from '@/api-client/quiz'
import { isErrorResponse } from '@/utils/is-error-response'
import { BackendImage } from '@/ui/backend-image'
import { FavoriteButton } from '@/components/quiz/favorite-button'
import styles from './managed-quizzes-list.module.scss'
import UpdateIcon from '@mui/icons-material/Edit'
import AnalyticsIcon from '@mui/icons-material/Insights'
import CreateIcon from '@mui/icons-material/Add'

export function ManagedQuizzesList() {
  const { data, isLoading } = useGetAllQuizzes({ managedByMe: true })

  const responseBody = data?.data

  if (isErrorResponse(responseBody)) {
    return <p>Error {responseBody.message}</p>
  }

  const quizzes = responseBody?.data

  return (
    <Stack spacing={3}>
      <div className={styles.header}>
        <Typography level="h2">Manage Quizzes</Typography>

        <Button component={Link} href={`/manage-quizzes/create`} variant="solid" startDecorator={<CreateIcon />}>
          Create Quiz
        </Button>
      </div>

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        <Stack spacing={2}>
          {quizzes?.map((quiz) => (
            <Sheet key={quiz.id} variant="outlined" className={styles.quizItem}>
              <BackendImage className={styles.image} src={quiz.imageUrl} alt="" />

              <div className={styles.details}>
                <Typography level="title-lg">{quiz.title}</Typography>
                <Typography level="body-sm" textColor="text.tertiary" className={styles.quizDescription}>
                  {quiz.description}
                </Typography>

                <div className={styles.actions}>
                  <Button
                    component={Link}
                    href={`/manage-quizzes/${quiz.id}/update`}
                    variant="soft"
                    startDecorator={<UpdateIcon />}
                  >
                    Update
                  </Button>

                  <Button variant="outlined" disabled={!quiz.isAnalyticsEnabled} startDecorator={<AnalyticsIcon />}>
                    Analytics
                  </Button>

                  <FavoriteButton quizId={quiz.id} isFavorite={!!quiz.isFavorite} />
                </div>
              </div>
            </Sheet>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
