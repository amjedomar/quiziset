'use client'

import {
  Box,
  Dropdown,
  IconButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from '@mui/joy'
import Link from 'next/link'
import PersonOutlineIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '@/hooks/use-auth'
import { UserAvatar } from '@/components/user-avatar'

export function ProfileDesktopMenu() {
  const { currentUser, logout } = useAuth()

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', sx: { p: 0, borderRadius: '50%' } } }}
      >
        <UserAvatar
          name={currentUser?.name ?? ''}
          imageUrl={currentUser?.imageUrl}
          sx={(theme) => ({
            border: `1px solid ${theme.vars.palette.primary[200]}`,
            width: 36,
            height: 36,
          })}
        />
      </MenuButton>

      <Menu placement="bottom-end" sx={{ minWidth: 200, zIndex: 1100 }}>
        {currentUser && (
          <Box sx={{ px: 1.5, py: 0.5 }}>
            <Typography level="title-sm">{currentUser.name}</Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              {currentUser.email}
            </Typography>
          </Box>
        )}

        <ListDivider />

        <MenuItem component={Link} href="/profile">
          <ListItemDecorator>
            <PersonOutlineIcon />
          </ListItemDecorator>
          Profile
        </MenuItem>

        <MenuItem color="danger" onClick={logout}>
          <ListItemDecorator>
            <LogoutIcon />
          </ListItemDecorator>
          Logout
        </MenuItem>
      </Menu>
    </Dropdown>
  )
}
