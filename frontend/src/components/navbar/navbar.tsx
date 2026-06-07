'use client'
import { Avatar, Box, Button, Container, Stack } from '@mui/joy'
import styles from '@/components/navbar/navbar.module.scss'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export default function Navbar() {
  const { isLoggedIn } = useAuth()

  return (
    <>
      <div className={styles.spacer}></div>

      <Box className={styles.navbar} sx={{ boxShadow: 'md' }}>
        <Container className={styles.navbarInner} maxWidth="xl">
          <div className={styles.mainNav}>
            <Link className={styles.appName} href="/">
              Quiziset
            </Link>

            <div className={styles.linksWrapper}>
              <Button component={Link} color="neutral" variant="plain" href="/">
                Explore
              </Button>

              <Button component={Link} color="neutral" variant="plain" href="/my-quizzes">
                My Quizzes
              </Button>

              <Button component={Link} color="neutral" variant="plain" href="/bookmarks">
                Bookmarks
              </Button>
            </div>
          </div>

          <Stack direction="row" spacing={1.5}>
            {isLoggedIn ? (
              <Avatar
                sx={(theme) => ({
                  border: `1px solid ${theme.vars.palette.primary[200]}`,
                })}
              >
                AO
              </Avatar>
            ) : (
              <>
                <Button variant="outlined" component={Link} href="/login">
                  Login
                </Button>

                <Button variant="solid" component={Link} href="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  )
}
