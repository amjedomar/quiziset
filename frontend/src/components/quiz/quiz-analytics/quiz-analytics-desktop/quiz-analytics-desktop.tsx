import { Sheet, Table } from '@mui/joy'
import { QuizAnalyticsSessionEntity } from '@/generated-api-client/model'
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
            <th className={styles.userColumn}>User</th>
            <th className={styles.scoreColumn}>Score</th>
            <th className={styles.durationColumn}>Duration</th>
            <th className={styles.dateColumn}>Started</th>
            <th className={styles.dateColumn}>Finished</th>
            <th className={styles.statusColumn}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td className={styles.userColumn}>
                <SessionUserCell user={session.user} />
              </td>
              <td className={styles.scoreColumn}>{formatQuizSessionScore(session)}</td>
              <td className={styles.durationColumn}>
                {session.finishTime ? formatTimeDuration(session.startTime, session.finishTime) : '—'}
              </td>
              <td className={styles.dateColumn}>{formatDateTime(session.startTime)}</td>
              <td className={styles.dateColumn}>{session.finishTime ? formatDateTime(session.finishTime) : '—'}</td>
              <td className={styles.statusColumn}>
                <SessionStatusChip isFinished={!!session.finishTime} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  )
}
