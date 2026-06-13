'use client'

import { Avatar, Box, Button, ButtonProps, Container, Divider, Drawer, IconButton, Stack } from '@mui/joy'
import styles from '@/components/navbar/navbar.module.scss'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import AddIcon from '@mui/icons-material/Add'
import BookmarkIcon from '@mui/icons-material/BookmarkBorderOutlined'
import SearchIcon from '@mui/icons-material/Search'
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import { ReactNode, useCallback, useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Explore', icon: <SearchIcon />, variant: 'plain' as const },
  { href: '/my-quizzes', label: 'Manage Quizzes', icon: <BallotOutlinedIcon />, variant: 'plain' as const },
  { href: '/bookmarks', label: 'Bookmarks', icon: <BookmarkIcon />, variant: 'plain' as const },
  { href: '/my-quizzes/create', label: 'Create Quiz', icon: <AddIcon />, variant: 'soft' as const },
]

function UserAvatar() {
  return (
    <Avatar
      sx={(theme) => ({
        border: `1px solid ${theme.vars.palette.primary[200]}`,
      })}
    >
      AO
    </Avatar>
  )
}

interface NavLinkButtonProps {
  href: string
  label: string
  icon: ReactNode
  variant: 'plain' | 'soft'
  size?: ButtonProps['size']
  fullWidth?: boolean
  onNavigate?: () => void
}

function NavLinkButton({ href, label, icon, variant, fullWidth, onNavigate, size }: NavLinkButtonProps) {
  return (
    <Button
      component={Link}
      color="neutral"
      variant={variant}
      href={href}
      startDecorator={icon}
      fullWidth={fullWidth}
      onClick={onNavigate}
      size={size}
      sx={{ justifyContent: 'start' }}
    >
      {label}
    </Button>
  )
}

export default function Navbar() {
  const { isLoggedIn } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return (
    <>
      <div className={styles.spacer}></div>

      <Box className={styles.navbar} sx={{ boxShadow: 'sm' }}>
        <Container className={styles.navbarInner} maxWidth="xl">
          <div className={styles.mainNav}>
            <Link className={styles.appName} href="/">
              Quiziset
            </Link>

            <Stack className={styles.desktopNav} direction="row" spacing={0.75}>
              {NAV_LINKS.map((link) => (
                <NavLinkButton key={link.href} {...link} />
              ))}
            </Stack>
          </div>

          <Stack className={styles.desktopAuth} direction="row" spacing={1.5}>
            {isLoggedIn ? (
              <UserAvatar />
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

          <IconButton
            className={styles.mobileMenuButton}
            variant="plain"
            color="neutral"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </Container>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer} size="sm">
        <Stack sx={{ p: 2 }} spacing={1.5}>
          {isLoggedIn ? (
            <Stack alignItems="center">
              <UserAvatar />
            </Stack>
          ) : (
            <>
              <Button fullWidth variant="outlined" component={Link} href="/login" onClick={closeDrawer}>
                Login
              </Button>

              <Button fullWidth variant="solid" component={Link} href="/signup" onClick={closeDrawer}>
                Sign Up
              </Button>
            </>
          )}
        </Stack>

        {!isLoggedIn && <Divider />}

        <Stack sx={{ p: 2, flex: 1 }} spacing={1}>
          {NAV_LINKS.map((link) => (
            <NavLinkButton key={link.href} {...link} fullWidth size="lg" onNavigate={closeDrawer} />
          ))}
        </Stack>
      </Drawer>
    </>
  )
}
