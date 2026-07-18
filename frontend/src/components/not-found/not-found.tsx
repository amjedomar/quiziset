'use client'
import { Link, Typography } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import { Ghost } from 'lucide-react'
import styles from './not-found.module.scss'

export function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <Ghost className={styles.icon} size={38} />

        <Typography level="h1" className={styles.code}>
          404
        </Typography>
      </div>

      <div className={styles.body}>
        <Typography level="h3">Page was not found</Typography>

        <Typography level="body-md" textColor="text.tertiary" className={styles.description}>
          The page you are looking for {"doesn't"} exist or may have been moved
        </Typography>

        <Link data-testid="explore-link" component={AppLink} href="/" underline="always">
          Return to Explore Page
        </Link>
      </div>
    </div>
  )
}
