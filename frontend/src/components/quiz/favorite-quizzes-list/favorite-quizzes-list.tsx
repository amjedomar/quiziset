'use client'

import { Link, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { QuizzesList } from '@/components/quiz/quizzes-list'
import { QuizzesGrid } from '@/components/quiz/quizzes-grid'
import styles from './favorite-quizzes-list.module.scss'

export function FavoriteQuizzesList() {
  return (
    <QuizzesList
      params={{ favoritedByMe: true, sortBy: 'name', sortOrder: 'asc' }}
      renderHeader={({ SearchComponent, SortComponent, TotalMatchesComponent }) => (
        <div className={styles.header}>
          <div className={styles.searchRow}>
            <SearchComponent className={styles.searchInput} placeholder="Search favorites" />

            <SortComponent />
          </div>

          <TotalMatchesComponent label={{ singular: 'favorite', plural: 'favorites' }} />
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
