'use client'
import { Box, Container, IconButton, Stack } from '@mui/joy'
import styles from '@/components/navbar/navbar.module.scss'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { ProfileDesktopMenu } from '@/components/navbar/profile-desktop-menu'
import { AuthButtons } from '@/components/navbar/auth-buttons'
import { NavLinkButton } from '@/components/navbar/nav-link-button'
import { NavbarMobileDrawer } from '@/components/navbar/navbar-mobile-drawer'
import { NAV_LINKS } from '@/components/navbar/nav-links'
import MenuIcon from '@mui/icons-material/Menu'
import { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  const isHomePage = pathname === '/'

  return (
    <>
      <div className={styles.primarySpacer} />

      {!isHomePage && <div className={styles.secondarySpacer} />}

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
            {isLoggedIn ? <ProfileDesktopMenu /> : <AuthButtons />}
          </Stack>

          <IconButton
            className={styles.mobileMenuButton}
            variant="plain"
            color="neutral"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Container>
      </Box>

      <NavbarMobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  )
}
