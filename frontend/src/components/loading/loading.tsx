import { CircularProgress } from '@mui/joy'
import styles from './loading.module.scss'

export function Loading() {
  return (
    <div className={styles.container}>
      <CircularProgress />
    </div>
  )
}
