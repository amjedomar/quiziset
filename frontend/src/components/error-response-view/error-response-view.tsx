import { ErrorResponse } from '@/api-client/model'
import { NotFound } from '@/components/not-found'
import styles from './error-response-view.module.scss'

interface ErrorResponseViewProps {
  error: ErrorResponse | undefined
}

export function ErrorResponseView({ error }: ErrorResponseViewProps) {
  if (!error) {
    return <p className={styles.message}>Unexpected error please reload page</p>
  }

  if (error.statusCode === 404) {
    return <NotFound />
  }

  return <div className={styles.message}>Error: {error.message}</div>
}
