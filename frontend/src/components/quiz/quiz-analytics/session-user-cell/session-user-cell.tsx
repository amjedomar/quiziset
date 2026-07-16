import { PublicUserEntity } from '@/generated-api-client/model'
import { UserAvatar } from '@/components/user-avatar'
import styles from './session-user-cell.module.scss'

interface SessionUserCellProps {
  user: PublicUserEntity
}

export function SessionUserCell({ user }: SessionUserCellProps) {
  return (
    <div className={styles.userCell}>
      <UserAvatar name={user.name} imageUrl={user.imageUrl} size="sm" />
      <span>{user.name}</span>
    </div>
  )
}
