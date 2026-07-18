'use client'
import { Box, Container, IconButton, Stack } from '@mui/joy'
import styles from '@/components/navbar/navbar.module.scss'
import { AppLink } from '@/ui/app-link'
import { ProfileDesktopMenu } from '@/components/navbar/profile-desktop-menu'
import { AuthButtons } from '@/components/navbar/auth-buttons'
import { NavLinkButton } from '@/components/navbar/nav-link-button'
import { NavbarMobileDrawer } from '@/components/navbar/navbar-mobile-drawer'
import { NAV_LINKS } from '@/components/navbar/nav-links'
import MenuIcon from '@mui/icons-material/Menu'
import { useCallback, useState } from 'react'

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return (
    <>
      <div className={styles.primarySpacer} />

      <div className={styles.secondarySpacer} />

      <Box className={styles.navbar} sx={{ boxShadow: 'sm' }}>
        <Container className={styles.navbarInner} maxWidth="xl">
          <div className={styles.mainNav}>
            <AppLink className={styles.appName} href="/">
              Quiziset
            </AppLink>

            <div className={styles.desktopNav}>
              {NAV_LINKS.map((link) => (
                <NavLinkButton key={link.href} {...link} testIdPrefix="desktop" />
              ))}
            </div>
          </div>

          {/* see "authNavbarScript" in "app/layout.tsx" */}
          <Stack className={styles.desktopAuth} direction="row">
            <div className={styles.authLoggedOut}>
              <AuthButtons />
            </div>
            <div className={styles.authLoggedIn}>
              <ProfileDesktopMenu />
            </div>
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
