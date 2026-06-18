'use client'
import { Container, Link } from '@mui/joy'
import NextLink from 'next/link'

export function NotFound() {
  return (
    <Container sx={{ textAlign: 'center' }}>
      <h2>Page was not found</h2>
      <Link component={NextLink} href="/" underline="always">
        Return to Explore Page
      </Link>
    </Container>
  )
}
