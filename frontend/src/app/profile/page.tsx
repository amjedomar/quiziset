import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { ProfileForm } from '@/components/profile/profile-form'

export const metadata: Metadata = {
  title: 'Profile',
}

export default function ProfilePage() {
  return (
    <Container maxWidth="sm">
      <ProfileForm />
    </Container>
  )
}
