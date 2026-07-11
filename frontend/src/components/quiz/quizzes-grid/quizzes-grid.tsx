'use client'

import { Box, Button, Sheet, Typography } from '@mui/joy'
import { QuizEntity } from '@/generated-api-client/model'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Loading } from '@/components/loading'
import { BackendBackgroundImage } from '@/ui/backend-background-image'
import { FavoriteButton } from '@/components/quiz/favorite-button'
import QuizIcon from '@mui/icons-material/Quiz'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import GroupsIcon from '@mui/icons-material/Groups'
import styles from './quizzes-grid.module.scss'

interface QuizzesGridProps {
  quizzes?: QuizEntity[]
  isLoading: boolean
  emptyInfo?: ReactNode
}

export function QuizzesGrid({ quizzes, isLoading, emptyInfo }: QuizzesGridProps) {
  if (isLoading) {
    return <Loading />
  }

  if (quizzes && quizzes.length === 0) {
    return emptyInfo ?? <Typography textColor="text.tertiary">No quizzes found</Typography>
  }

  return (
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
          {/*
            to avoid image flashing issue (during page load)
            use `background-image` style INSTEAD OF <img /> (with object-fit: cover)
            see https://stackoverflow.com/a/64209838/8148505
          */}
          <BackendBackgroundImage className={styles.image} src={quiz.imageUrl} />

          <div className={styles.details}>
            <div>
              <Typography level="title-lg">{quiz.title}</Typography>

              <div className={styles.meta}>
                <Typography
                  level="body-sm"
                  startDecorator={<StarRoundedIcon fontSize="small" className={styles.ratingIcon} />}
                >
                  {quiz.averageRating.toFixed(1)}
                </Typography>

                <Typography level="body-sm" textColor="text.tertiary" startDecorator={<GroupsIcon fontSize="small" />}>
                  {quiz.totalFinishes} {quiz.totalFinishes === 1 ? 'finish' : 'finishes'}
                </Typography>
              </div>
            </div>

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
  )
}
