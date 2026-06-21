'use client'
import { Container, Typography, Link, Input } from '@mui/joy'
import NextLink from 'next/link'
import SearchIcon from '@mui/icons-material/Search'
import { QuizzesList } from '@/components/quiz/quizzes-list'
import styles from './homepage.module.scss'

export default function Homepage() {
  return (
    <>
      <div className={styles.hero}>
        <Container maxWidth="xl">
          <Typography sx={{ mb: 2 }} level="h1" textAlign="center" color="primary">
            Quiziset
          </Typography>

          <Typography sx={{ mb: 3 }} textAlign="center">
            Explore different quizzes to test your skills or{' '}
            <Link component={NextLink} href="/manage-quizzes/create" underline="always">
              create your own quiz
            </Link>
          </Typography>

          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Input variant="outlined" startDecorator={<SearchIcon />} placeholder="Search for Quizzes" size="lg" />
          </div>
        </Container>
      </div>

      <Container maxWidth="xl">
        <QuizzesList />
      </Container>
    </>
  )
}
