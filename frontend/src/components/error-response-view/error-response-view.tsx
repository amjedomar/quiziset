import { ErrorResponse } from '@/generated-api-client/model'
import { NotFound } from '@/components/not-found'
import { NETWORK_ERROR } from '@/constants/network-error-status'
import ErrorIcon from '@mui/icons-material/Report'
import { ServerOff } from 'lucide-react'
import clsx from 'clsx'
import styles from './error-response-view.module.scss'

interface ErrorResponseViewProps {
  error: ErrorResponse | undefined | null
}

export function ErrorResponseView({ error }: ErrorResponseViewProps) {
  if (error?.statusCode === 404) {
    return <NotFound />
  }

  return (
    <>
      <div className={styles.errorState}>
        <div className={styles.iconWrapper}>
          {error?.statusCode === NETWORK_ERROR ? (
            <ServerOff className={styles.errorIcon} size={52} />
          ) : (
            <ErrorIcon className={clsx(styles.errorIcon, styles.muiJoyIcon)} />
          )}
        </div>

        {error ? (
          <>
            {error.statusCode === NETWORK_ERROR ? (
              <>
                <p className={styles.heading}>Cannot connect to Backend API</p>
                <p className={styles.description}>
                  Either {"you're"} offline or our backend is down (Please try again later)
                </p>
              </>
            ) : error.statusCode >= 500 ? (
              <>
                <p className={styles.heading}>Something went wrong on our end</p>
                <p className={styles.description}>Our backend ran into an internal error (Please try again later)</p>
              </>
            ) : (
              <>
                <p className={styles.otherError}>Error: {error.message}</p>
              </>
            )}
          </>
        ) : (
          <p className={styles.otherError}>Unexpected error (please reload the page)</p>
        )}
      </div>
    </>
  )
}
