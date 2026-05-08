'use client'
import { Box, Button, Stack } from '@mui/joy'
import styles from '@/components/navbar/navbar.module.scss'
import Link from 'next/link'

export default function Navbar() {
  return (
    <Box className={styles.navbar} sx={{ boxShadow: 'md' }}>
      <Link className={styles.appName} href="/">
        Quiziset
      </Link>

      <Stack direction="row" spacing={1}>
        <Button variant="outlined" component={Link} href="/login">
          Login
        </Button>

        <Button variant="solid" component={Link} href="/signup">
          Sign Up
        </Button>
      </Stack>
    </Box>
  )
}
