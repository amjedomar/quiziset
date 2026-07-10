import type { Metadata } from 'next'
import { Container, Stack, Typography } from '@mui/joy'
import { FavoriteQuizzesList } from '@/components/quiz/favorite-quizzes-list'

export const metadata: Metadata = {
  title: 'Favorites',
}

export default function FavoritesPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Typography level="h2">Favorites</Typography>

        <FavoriteQuizzesList />
      </Stack>
    </Container>
  )
}
