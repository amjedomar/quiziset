import { CircularProgress } from '@mui/joy'
import styles from './loading-box.module.scss'

/**
 * it simply render <CircularProgress /> (but make sure it is centered)
 */
export function LoadingBox() {
  return (
    <div className={styles.loadingBox}>
      <CircularProgress />
    </div>
  )
}
