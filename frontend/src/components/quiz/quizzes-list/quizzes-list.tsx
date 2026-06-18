'use client'

import { Box, Button, Sheet, Stack, Typography } from '@mui/joy'
import { useGetAllQuizzes } from '@/api-client/quiz'
import { isErrorResponse } from '@/utils/is-error-response'
import styles from './quizzes-list.module.scss'
import QuizIcon from '@mui/icons-material/Quiz'
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import Link from 'next/link'
import { MouseEventHandler } from 'react'
import { Loading } from '@/components/loading'

export function QuizzesList() {
  const { data, isLoading } = useGetAllQuizzes()

  if (isErrorResponse(data?.data)) {
    return <p>Error {data.data.message}</p>
  }

  const quizzes = data?.data

  const handleFavoriteClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    // prevent link navigation when favorite button is clicked
    e.stopPropagation()
    e.preventDefault()

    // TODO: implement favorite button logic
  }

  return (
    <Stack spacing={3}>
      {isLoading ? (
        <Loading />
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
              href={`/quizzes/${quiz.id}/view`}
            >
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

                <Button variant="outlined" onClick={handleFavoriteClick}>
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
