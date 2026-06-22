'use client'

import { Box, Breadcrumbs, Button, Chip, Container, Link, Typography } from '@mui/joy'
import { useGetSingleQuiz } from '@/api-client/quiz'
import { isErrorOrNoResponse } from '@/utils/is-error-response'
import { ErrorResponseView } from '@/components/error-response-view'
import { Loading } from '@/components/loading'
import NextLink from 'next/link'
import StartIcon from '@mui/icons-material/PlayCircleFilledWhite'
import TimerIcon from '@mui/icons-material/Timer'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import styles from './quiz-overview.module.scss'

interface QuizOverviewProps {
  quizId: number
}

export default function QuizOverview({ quizId }: QuizOverviewProps) {
  const { data, isLoading } = useGetSingleQuiz(quizId, { fields: 'OVERVIEW' })

  const quiz = data?.data

  if (isLoading) {
    return <Loading />
  }

  if (isErrorOrNoResponse(quiz)) {
    return <ErrorResponseView error={quiz} />
  }

  const {
    title,
    description,
    imageUrl,
    timeDurationInMinutes,
    totalFinishes,
    wasTakenByCurrentUserAtLeastOnce,
    doesCurrentUserHaveActiveSession,
  } = quiz

  return (
    <Container maxWidth="md">
      <Breadcrumbs sx={{ px: 0 }}>
        <Link component={NextLink} href="/" color="neutral">
          Explore
        </Link>
        <Typography>{title}</Typography>
      </Breadcrumbs>

      <img className={styles.image} src={imageUrl} alt={title} />

      <div className={styles.header}>
        <div>
          <Typography level="h1" className={styles.title}>
            {title}
          </Typography>

          <div className={styles.chipsContainer}>
            <Chip
              variant="soft"
              color="neutral"
              startDecorator={timeDurationInMinutes ? <TimerIcon /> : <TimerOffIcon />}
            >
              {timeDurationInMinutes ? `${timeDurationInMinutes} min` : 'No time limit'}
            </Chip>

            <Chip variant="soft" color="neutral" startDecorator={<AnalyticsIcon />}>
              Collects Analytics
            </Chip>

            <Chip variant="soft" color="neutral" startDecorator={<GroupsIcon />}>
              {totalFinishes} {totalFinishes === 1 ? 'finish' : 'finishes'}
            </Chip>

            {wasTakenByCurrentUserAtLeastOnce && (
              <Chip variant="soft" color="success" startDecorator={<CheckCircleIcon />}>
                Finished Before
              </Chip>
            )}
          </div>
        </div>

        <Button
          component={NextLink}
          href={`/quizzes/${quizId}/session`}
          startDecorator={<StartIcon />}
          size="lg"
          className={styles.ctaButton}
        >
          {doesCurrentUserHaveActiveSession ? 'Resume Quiz' : 'Start Quiz'}
        </Button>
      </div>

      <Box className={styles.descriptionSection}>
        <Typography level="title-md">About this quiz</Typography>

        <Typography level="body-md" textColor="text.secondary" className={styles.descriptionText}>
          {description}
        </Typography>
      </Box>
    </Container>
  )
}
