'use client'

import { Box, Button, CircularProgress, Sheet, Stack, Typography } from '@mui/joy'
import { useGetAllQuizzes } from '@/api-client/quiz'
import { isErrorResponse } from '@/utils/is-error-response'
import styles from './quizzes-list.module.scss'
import QuizIcon from '@mui/icons-material/Quiz'
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'

export function QuizzesList() {
  const { data, isLoading } = useGetAllQuizzes()

  if (isErrorResponse(data?.data)) {
    return <p>Error {data.data.message}</p>
  }

  const quizzes = data?.data

  return (
    <Stack spacing={3}>
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
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
            <Sheet key={quiz.id} variant="outlined" className={styles.quizCard}>
              <img className={styles.image} src={quiz.imageUrl} alt="" />

              <div className={styles.details}>
                <Typography level="title-lg">{quiz.title}</Typography>
                <Typography level="body-sm" textColor="text.tertiary">
                  {quiz.description}
                </Typography>
              </div>

              <div className={styles.footer}>
                <Button variant="solid" startDecorator={<QuizIcon />}>
                  View
                </Button>

                <Button variant="outlined">
                  <FavoriteIcon />
                </Button>
              </div>
            </Sheet>
          ))}
        </Box>
      )}
    </Stack>
  )
}
