'use client'

import { Link, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { QuizzesList } from '@/components/quiz/quizzes-list'

export function FavoriteQuizzesList() {
  return (
    <QuizzesList
      params={{ favoritedByMe: true }}
      emptyInfo={
        <Stack spacing={0.5}>
          <Typography textColor="text.tertiary">No favorites yet</Typography>
          <Typography textColor="text.tertiary">
            Explore quizzes in the{' '}
            <Link component={NextLink} href="/" color="primary" underline="always">
              Explore page
            </Link>{' '}
            and you can mark favorites there
          </Typography>
        </Stack>
      }
    />
  )
}
