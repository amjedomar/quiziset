'use client'

import { Box, Button, Divider, Drawer, Stack, Typography } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import PersonOutlineIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '@/hooks/use-auth'
import { UserAvatar } from '@/components/user-avatar'
import { NavLinkButton } from '@/components/navbar/nav-link-button'
import { NAV_LINKS } from '@/components/navbar/nav-links'

interface NavbarMobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function NavbarMobileDrawer({ open, onClose }: NavbarMobileDrawerProps) {
  const { isLoggedIn, currentUser, logout } = useAuth()

  return (
    <Drawer anchor="right" open={open} onClose={onClose} size="sm">
      {isLoggedIn ? (
        <Stack alignItems="center" spacing={1} sx={{ p: 2 }}>
          <UserAvatar
            name={currentUser?.name ?? ''}
            imageUrl={currentUser?.imageUrl}
            sx={{ width: 64, height: 64, fontSize: 'xl' }}
          />
          <Box sx={{ textAlign: 'center', maxWidth: '100%' }}>
            <Typography level="title-md">{currentUser?.name}</Typography>
            <Typography level="body-sm" textColor="text.tertiary">
              {currentUser?.email}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Stack sx={{ p: 2 }} spacing={1.5}>
          <Button
            data-testid="mobile-login-link"
            fullWidth
            variant="outlined"
            component={AppLink}
            href="/login"
            onClick={onClose}
          >
            Login
          </Button>

          <Button
            data-testid="mobile-signup-link"
            fullWidth
            variant="solid"
            component={AppLink}
            href="/signup"
            onClick={onClose}
          >
            Sign Up
          </Button>
        </Stack>
      )}

      <Divider />

      <Stack sx={{ p: 2 }} spacing={1}>
        {NAV_LINKS.map((link) => (
          <NavLinkButton key={link.href} {...link} fullWidth size="lg" onNavigate={onClose} testIdPrefix="mobile" />
        ))}
      </Stack>

      {isLoggedIn && (
        <>
          <Divider />

          <Stack sx={{ p: 2 }} spacing={1}>
            <NavLinkButton
              href="/profile"
              label="Update Profile"
              icon={<PersonOutlineIcon />}
              variant="plain"
              fullWidth
              size="lg"
              onNavigate={onClose}
              testIdPrefix="mobile"
            />

            <Button
              data-testid="mobile-logout-button"
              color="danger"
              variant="plain"
              fullWidth
              size="lg"
              startDecorator={<LogoutIcon />}
              onClick={() => {
                logout()
                onClose()
              }}
              sx={{ justifyContent: 'start' }}
            >
              Logout
            </Button>
          </Stack>
        </>
      )}
    </Drawer>
  )
}
