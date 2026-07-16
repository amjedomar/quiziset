'use client'

import { Button, Chip, Container, Divider, Typography } from '@mui/joy'
import { useGetSingleQuiz } from '@/generated-api-client/quiz'
import { ErrorResponseView } from '@/components/error-response-view'
import { useRetainedQuery } from '@/hooks/use-retained-query'
import { Loading } from '@/components/loading'
import { ReviewsSection } from '@/components/reviews/reviews-section'
import NextLink from 'next/link'
import StartIcon from '@mui/icons-material/PlayCircleFilledWhite'
import TimerIcon from '@mui/icons-material/Timer'
import TimerOffIcon from '@mui/icons-material/TimerOff'
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PrivateIcon from '@mui/icons-material/Lock'
import { BackendImage } from '@/ui/backend-image'
import { FavoriteButton } from '@/components/quiz/favorite-button'
import { ShareQuizButton } from '@/components/quiz/share-quiz-button'
import { UserAvatar } from '@/components/user-avatar'
import styles from './quiz-overview.module.scss'

interface QuizOverviewProps {
  quizId: number
}

export function QuizOverview({ quizId }: QuizOverviewProps) {
  const queryResult = useGetSingleQuiz(quizId, { fields: 'OVERVIEW' })
  const { data: quiz, error, isLoading } = useRetainedQuery(queryResult)

  if (isLoading) {
    return <Loading />
  }

  if (!quiz) {
    return <ErrorResponseView error={error} />
  }

  const {
    title,
    description,
    imageUrl,
    isPublic,
    isAnalyticsEnabled,
    timeDurationInMinutes,
    totalFinishes,
    wasTakenByCurrentUserAtLeastOnce,
    doesCurrentUserHaveActiveSession,
    isFavorite,
    manager,
  } = quiz

  return (
    <Container maxWidth="lg">
      <div className={styles.topBar}>
        <Button
          component={NextLink}
          href="/"
          variant="plain"
          size="sm"
          startDecorator={<ArrowBackIcon />}
          className={styles.backButton}
        >
          Explore
        </Button>

        <ShareQuizButton quizId={quizId} size="md" labelDisplay="responsive" disabled={!isPublic} />
      </div>

      <div className={styles.paper}>
        <BackendImage className={styles.image} src={imageUrl} alt={title} />

        <div className={styles.body}>
          <div className={styles.header}>
            <div>
              <div>
                <Typography data-testid="quiz-title" level="h1" className={styles.title}>
                  {title}
                </Typography>
              </div>

              <div className={styles.chipsContainer}>
                {!isPublic && (
                  <Chip variant="soft" color="danger" startDecorator={<PrivateIcon />}>
                    Private
                  </Chip>
                )}

                <Chip
                  variant="soft"
                  color="neutral"
                  startDecorator={timeDurationInMinutes ? <TimerIcon /> : <TimerOffIcon />}
                >
                  {timeDurationInMinutes ? `${timeDurationInMinutes} min` : 'No time limit'}
                </Chip>

                {isAnalyticsEnabled && (
                  <Chip variant="soft" color="neutral" startDecorator={<PrivacyTipIcon />}>
                    Collects Analytics
                  </Chip>
                )}

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
              <Button
                data-testid="start-quiz-link"
                component={NextLink}
                href={`/quizzes/${quizId}/session`}
                startDecorator={<StartIcon />}
                size="lg"
                className={styles.ctaButton}
              >
                {doesCurrentUserHaveActiveSession ? 'Resume Quiz' : 'Start Quiz'}
              </Button>

              <FavoriteButton quizId={quizId} isFavorite={!!isFavorite} size="lg" />
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
