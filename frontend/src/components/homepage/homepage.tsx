'use client'
import { Typography, Link, Input } from '@mui/joy'
import NextLink from 'next/link'
import SearchIcon from '@mui/icons-material/Search'
import { GetAllQuizzesParams } from '@/generated-api-client/model'
import { QuizzesList } from '@/components/quiz/quizzes-list'
import { QuizzesGrid } from '@/components/quiz/quizzes-grid'
import styles from './homepage.module.scss'

interface HomepageProps {
  initialParams: GetAllQuizzesParams
}

export default function Homepage({ initialParams }: HomepageProps) {
  return (
    <QuizzesList
      params={initialParams}
      renderHeader={({ SortComponent, totalMatches, onSearch }) => (
        <>
          <div className={styles.hero}>
            <Typography className={styles.title} level="h1" textAlign="center" color="primary">
              Quiziset
            </Typography>

            <Typography className={styles.subtitle} textAlign="center">
              Explore different quizzes to test your skills or{' '}
              <Link component={NextLink} href="/manage-quizzes/create" underline="always">
                create your own quiz
              </Link>
            </Typography>

            <div className={styles.searchRow}>
              <Input
                className={styles.searchInput}
                variant="outlined"
                startDecorator={<SearchIcon />}
                placeholder="Search for Quizzes"
                size="lg"
                onChange={(event) => onSearch(event.target.value)}
              />

              <SortComponent className={styles.sortSelect} size="lg" />
            </div>
          </div>

          <Typography className={styles.totalMatches} textColor="text.tertiary">
            {totalMatches} total {totalMatches === 1 ? 'match' : 'matches'}
          </Typography>
        </>
      )}
      renderQuizzes={({ quizzes, isLoading }) => <QuizzesGrid quizzes={quizzes} isLoading={isLoading} />}
    />
  )
}
