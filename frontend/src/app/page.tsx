'use client'
import { Container, Typography, Link, Input } from '@mui/joy'
import NextLink from 'next/link'
import SearchIcon from '@mui/icons-material/Search'

export default function Home() {
  return (
    <Container maxWidth="xl">
      <Typography sx={{ mb: 2 }} level="h1" textAlign="center" color="primary">
        Quiziset
      </Typography>

      <Typography sx={{ mb: 3 }} textAlign="center">
        Explore different quizzes to test your skills or{' '}
        <Link component={NextLink} href="/my-quizzes/create" underline="always">
          create your own quiz
        </Link>
      </Typography>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Input
          variant="outlined"
          startDecorator={<SearchIcon />}
          placeholder="Search"
          size="lg"
          // endDecorator={<Button>Message</Button>}
        />
      </div>
    </Container>
  )
}
