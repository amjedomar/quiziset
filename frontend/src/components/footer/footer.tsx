import { Link } from '@mui/joy'
import styles from './footer.module.scss'

export function Footer() {
  return (
    <div className={styles.footer}>
      <p className={styles.note}>
        Quiziset was developed by{' '}
        <Link href="https://www.linkedin.com/in/amjedomar" target="_blank" fontSize="inherit">
          Amjed Omar
        </Link>
      </p>
      <p className={styles.note}>
        Images from{' '}
        <Link href="https://unsplash.com" target="_blank" underline="always" fontSize="inherit">
          Unsplash
        </Link>
      </p>
    </div>
  )
}
