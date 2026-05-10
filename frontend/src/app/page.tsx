'use client'
import { Container, Typography, Link, Input } from '@mui/joy'
import NextLink from 'next/link'
import SearchIcon from '@mui/icons-material/Search'

export default function Home() {
  return (
    <Container maxWidth="xl">
      <Typography textAlign="center">
        Explore different quizzes to test your skills or{' '}
        <Link component={NextLink} href="/my-quizzes" underline="always">
          create your own
        </Link>
      </Typography>
      <br />
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Input
          startDecorator={<SearchIcon />}
          placeholder="Search"
          size="lg"
          // endDecorator={<Button>Message</Button>}
        />
      </div>
    </Container>
  )
}
