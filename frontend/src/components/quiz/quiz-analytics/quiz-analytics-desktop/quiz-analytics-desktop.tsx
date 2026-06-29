import { Sheet, Table } from '@mui/joy'
import { QuizAnalyticsSessionEntity } from '@/api-client/model'
import { formatDateTime, formatTimeDuration } from '@/utils/dates'
import { formatQuizSessionScore } from '@/utils/quiz-session'
import { SessionStatusChip } from '@/components/quiz/quiz-analytics/session-status-chip'
import { SessionUserCell } from '@/components/quiz/quiz-analytics/session-user-cell'
import styles from './quiz-analytics-desktop.module.scss'

interface QuizAnalyticsDesktopProps {
  sessions: QuizAnalyticsSessionEntity[]
}

/**
 * desktop view (a table)
 *
 * hidden on mobile where the cards view is shown instead
 */
export function QuizAnalyticsDesktop({ sessions }: QuizAnalyticsDesktopProps) {
  return (
    <Sheet variant="outlined" className={styles.tableWrapper}>
      <Table stickyHeader hoverRow className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
            <th>Duration</th>
            <th className={styles.dateColumn}>Started</th>
            <th className={styles.dateColumn}>Finished</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>
                <SessionUserCell user={session.user} />
              </td>
              <td>{formatQuizSessionScore(session)}</td>
              <td>{session.finishTime ? formatTimeDuration(session.startTime, session.finishTime) : '—'}</td>
              <td className={styles.dateColumn}>{formatDateTime(session.startTime)}</td>
              <td className={styles.dateColumn}>{session.finishTime ? formatDateTime(session.finishTime) : '—'}</td>
              <td>
                <SessionStatusChip isFinished={!!session.finishTime} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  )
}
