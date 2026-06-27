import { Avatar, AvatarProps } from '@mui/joy'
import { NEXT_PUBLIC_API_BASE_URL } from '@/constants/api-url'
import { getInitials } from '@/utils/get-initials'

interface UserAvatarProps extends Omit<AvatarProps, 'src'> {
  name: string
  imageUrl?: string | null
}

export function UserAvatar({ name, imageUrl, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props} src={imageUrl ? `${NEXT_PUBLIC_API_BASE_URL}${imageUrl}` : undefined} alt={name}>
      {getInitials(name)}
    </Avatar>
  )
}
