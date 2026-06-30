import { Sheet } from '@mui/joy'
import { QuizAnalyticsSessionEntity } from '@/generated-api-client/model'
import { formatDateTime, formatTimeDuration } from '@/utils/dates'
import { formatQuizSessionScore } from '@/utils/quiz-session'
import { SessionStatusChip } from '@/components/quiz/quiz-analytics/session-status-chip'
import { SessionUserCell } from '@/components/quiz/quiz-analytics/session-user-cell'
import styles from './quiz-analytics-mobile.module.scss'

interface QuizAnalyticsMobileProps {
  sessions: QuizAnalyticsSessionEntity[]
}

/**
 * mobile view (a list of cards)
 *
 * hidden on desktop where the table view is shown instead
 */
export function QuizAnalyticsMobile({ sessions }: QuizAnalyticsMobileProps) {
  return (
    <div className={styles.cards}>
      {sessions.map((session) => (
        <Sheet key={session.id} variant="outlined" className={styles.card}>
          <div className={styles.cardHeader}>
            <SessionUserCell user={session.user} />
            <SessionStatusChip isFinished={!!session.finishTime} />
          </div>

          <dl className={styles.cardRows}>
            <div className={styles.cardRow}>
              <dt>Score</dt>
              <dd>{formatQuizSessionScore(session)}</dd>
            </div>
            <div className={styles.cardRow}>
              <dt>Duration</dt>
              <dd>{session.finishTime ? formatTimeDuration(session.startTime, session.finishTime) : '—'}</dd>
            </div>
            <div className={styles.cardRow}>
              <dt>Started</dt>
              <dd>{formatDateTime(session.startTime)}</dd>
            </div>
            <div className={styles.cardRow}>
              <dt>Finished</dt>
              <dd>{session.finishTime ? formatDateTime(session.finishTime) : '—'}</dd>
            </div>
          </dl>
        </Sheet>
      ))}
    </div>
  )
}
