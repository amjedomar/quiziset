import { Container, Stack, Typography } from '@mui/joy'
import { FavoriteQuizzesList } from '@/components/quiz/favorite-quizzes-list'

export const dynamic = 'force-dynamic'

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
