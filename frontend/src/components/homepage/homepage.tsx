'use client'
import { Typography, Link } from '@mui/joy'
import NextLink from 'next/link'
import { GetAllQuizzesParams } from '@/generated-api-client/model'
import { QuizzesList } from '@/components/quiz/quizzes-list'
import { QuizzesGrid } from '@/components/quiz/quizzes-grid'
import styles from './homepage.module.scss'

interface HomepageProps {
  initialParams: GetAllQuizzesParams
}

export function Homepage({ initialParams }: HomepageProps) {
  return (
    <QuizzesList
      params={initialParams}
      renderHeader={({ SearchComponent, SortComponent, TotalMatchesComponent }) => (
        <>
          <div className={styles.hero}>
            <Typography className={styles.title} level="h1" textAlign="center" color="primary">
              Quiziset
            </Typography>

            <Typography className={styles.subtitle} textAlign="center">
              Explore different quizzes to test your skills or{' '}
              <Link
                data-testid="create-quiz-link"
                component={NextLink}
                href="/manage-quizzes/create"
                underline="always"
              >
                create your own quiz
              </Link>
            </Typography>

            <div className={styles.searchRow}>
              <SearchComponent className={styles.searchInput} placeholder="Search for Quizzes" size="lg" />

              <SortComponent className={styles.sortSelect} size="lg" />
            </div>
          </div>

          <TotalMatchesComponent
            label={{ singular: 'match', plural: 'matches' }}
            size="md"
            className={styles.totalMatches}
          />
        </>
      )}
      renderQuizzes={({ quizzes, isLoading }) => <QuizzesGrid quizzes={quizzes} isLoading={isLoading} />}
    />
  )
}
