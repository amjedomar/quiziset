'use client'

import { Input, Link, Typography } from '@mui/joy'
import NextLink from 'next/link'
import SearchIcon from '@mui/icons-material/Search'
import { QuizzesList } from '@/components/quiz/quizzes-list'
import { QuizzesGrid } from '@/components/quiz/quizzes-grid'
import styles from './favorite-quizzes-list.module.scss'

export function FavoriteQuizzesList() {
  return (
    <QuizzesList
      params={{ favoritedByMe: true }}
      renderHeader={({ SortComponent, totalMatches, onSearch }) => (
        <div className={styles.header}>
          <div className={styles.searchRow}>
            <Input
              className={styles.searchInput}
              variant="outlined"
              startDecorator={<SearchIcon />}
              placeholder="Search favorites"
              onChange={(event) => onSearch(event.target.value)}
            />

            <SortComponent />
          </div>

          <Typography level="body-sm" textColor="text.tertiary">
            {totalMatches} total {totalMatches === 1 ? 'match' : 'matches'}
          </Typography>
        </div>
      )}
      renderQuizzes={({ quizzes, isLoading }) => (
        <QuizzesGrid
          quizzes={quizzes}
          isLoading={isLoading}
          emptyInfo={
            <div className={styles.emptyInfo}>
              <Typography textColor="text.tertiary">No favorites yet</Typography>
              <Typography textColor="text.tertiary">
                Explore quizzes in the{' '}
                <Link data-testid="explore-page-link" component={NextLink} href="/" color="primary" underline="always">
                  Explore page
                </Link>{' '}
                and you can mark favorites there
              </Typography>
            </div>
          }
        />
      )}
    />
  )
}
