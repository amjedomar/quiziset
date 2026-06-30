'use client'

import { Breadcrumbs, Button, Chip, Container, Divider, Link, Typography } from '@mui/joy'
import { useGetSingleQuiz } from '@/generated-api-client/quiz'
import { isErrorOrNoResponse } from '@/utils/is-error-response'
import { ErrorResponseView } from '@/components/error-response-view'
import { Loading } from '@/components/loading'
import { ReviewsSection } from '@/components/reviews/reviews-section'
import NextLink from 'next/link'
import StartIcon from '@mui/icons-material/PlayCircleFilledWhite'
import TimerIcon from '@mui/icons-material/Timer'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import { BackendImage } from '@/ui/backend-image'
import { FavoriteButton } from '@/components/quiz/favorite-button'
import { UserAvatar } from '@/components/user-avatar'
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
    isFavorite,
    manager,
  } = quiz

  return (
    <Container maxWidth="lg">
      <Breadcrumbs className={styles.breadcrumbs}>
        <Link component={NextLink} href="/" color="neutral">
          Explore
        </Link>
        <Typography>{title}</Typography>
      </Breadcrumbs>

      <div className={styles.paper}>
        <BackendImage className={styles.image} src={imageUrl} alt={title} />

        <div className={styles.body}>
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
                    Taken
                  </Chip>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <FavoriteButton quizId={quizId} isFavorite={!!isFavorite} size="lg" />

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
          </div>

          <div className={styles.descriptionSection}>
            <Typography level="title-md" className={styles.aboutHeading}>
              About this quiz
            </Typography>

            {manager && (
              <div className={styles.managerRow}>
                <UserAvatar name={manager.name} imageUrl={manager.imageUrl} size="sm" />
                <Typography level="body-sm" textColor="text.secondary">
                  Created by {manager.name}
                </Typography>
              </div>
            )}

            <Typography level="body-md" textColor="text.secondary" className={styles.descriptionText}>
              {description}
            </Typography>
          </div>

          <Divider className={styles.divider} />

          <ReviewsSection quizId={quizId} canReview={Boolean(wasTakenByCurrentUserAtLeastOnce)} />
        </div>
      </div>
    </Container>
  )
}
