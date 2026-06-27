import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import SearchIcon from '@mui/icons-material/Search'
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import { NavLinkButtonProps } from '@/components/navbar/nav-link-button'

type NavLink = Pick<NavLinkButtonProps, 'href' | 'label' | 'icon' | 'variant'>

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Explore', icon: <SearchIcon />, variant: 'plain' },
  { href: '/manage-quizzes', label: 'Manage Quizzes', icon: <BallotOutlinedIcon />, variant: 'plain' },
  { href: '/favorites', label: 'Favorites', icon: <FavoriteIcon />, variant: 'plain' },
]
