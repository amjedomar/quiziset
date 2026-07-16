'use client'
import { Button, CircularProgress, IconButton, Sheet, Typography } from '@mui/joy'
import Link from 'next/link'
import { BackendImage } from '@/ui/backend-image'
import { DisabledTooltip } from '@/ui/disabled-tooltip'
import { FavoriteButton } from '@/components/quiz/favorite-button'
import { ShareQuizButton } from '@/components/quiz/share-quiz-button'
import { QuizzesList } from '@/components/quiz/quizzes-list'
import styles from './managed-quizzes-list.module.scss'
import UpdateIcon from '@mui/icons-material/Edit'
import AnalyticsIcon from '@mui/icons-material/Insights'
import PreviewIcon from '@mui/icons-material/VisibilityOutlined'
import CreateIcon from '@mui/icons-material/Add'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import GroupsIcon from '@mui/icons-material/Groups'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'

export function ManagedQuizzesList() {
  return (
    <QuizzesList
      params={{ managedByMe: true }}
      renderHeader={({ SearchComponent, SortComponent, TotalMatchesComponent }) => (
        <div className={styles.headerSection}>
          <div className={styles.header}>
            <Typography level="h2">Manage Quizzes</Typography>

            <Button
              data-testid="create-quiz-link"
              component={Link}
              href={`/manage-quizzes/create`}
              variant="solid"
              startDecorator={<CreateIcon />}
            >
              Create Quiz
            </Button>
          </div>

          <div className={styles.searchRow}>
            <SearchComponent className={styles.searchInput} placeholder="Search your quizzes" />

            <SortComponent />
          </div>

          <TotalMatchesComponent label={{ singular: 'match', plural: 'matches' }} />
        </div>
      )}
      renderQuizzes={({ quizzes, isLoading }) =>
        isLoading ? (
          <div className={styles.loading}>
            <CircularProgress />
          </div>
        ) : (
          <div className={styles.quizList}>
            {quizzes?.map((quiz) => (
              <Sheet key={quiz.id} variant="outlined" className={styles.quizItem}>
                <BackendImage className={styles.image} src={quiz.imageUrl} alt="" />

                <div className={styles.details}>
                  <Typography level="title-lg">{quiz.title}</Typography>

                  <div className={styles.meta}>
                    <Typography
                      level="body-sm"
                      startDecorator={<StarRoundedIcon fontSize="small" className={styles.ratingIcon} />}
                    >
                      {quiz.averageRating.toFixed(1)}
                    </Typography>

                    <Typography
                      level="body-sm"
                      textColor="text.tertiary"
                      startDecorator={<GroupsIcon fontSize="small" />}
                    >
                      {quiz.totalFinishes} {quiz.totalFinishes === 1 ? 'finish' : 'finishes'}
                    </Typography>

                    <Typography
                      level="body-sm"
                      textColor="text.tertiary"
                      startDecorator={quiz.isPublic ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                    >
                      {quiz.isPublic ? 'Public' : 'Private'}
                    </Typography>
                  </div>

                  <Typography level="body-sm" textColor="text.tertiary" className={styles.quizDescription}>
                    {quiz.description}
                  </Typography>

                  <div className={styles.primaryActions}>
                    <Button
                      data-testid={`update-quiz-${quiz.id}-link`}
                      component={Link}
                      href={`/manage-quizzes/${quiz.id}/update`}
                      variant="soft"
                      startDecorator={<UpdateIcon />}
                    >
                      Update
                    </Button>

                    <div className={styles.primaryActionsSub}>
                      <DisabledTooltip
                        disabled={!quiz.isAnalyticsEnabled}
                        title="Analytics is not enabled for this quiz"
                      >
                        <Button
                          data-testid={`quiz-${quiz.id}-analytics-link`}
                          component={Link}
                          href={`/manage-quizzes/${quiz.id}/analytics`}
                          variant="outlined"
                          startDecorator={<AnalyticsIcon />}
                        >
                          Analytics
                        </Button>
                      </DisabledTooltip>

                      <FavoriteButton
                        className={styles.favoriteAction}
                        quizId={quiz.id}
                        isFavorite={!!quiz.isFavorite}
                      />
                    </div>
                  </div>

                  <div className={styles.secondaryActions}>
                    <IconButton
                      className={styles.previewAction}
                      data-testid={`quiz-${quiz.id}-overview-link`}
                      component={Link}
                      href={`/quizzes/${quiz.id}/overview`}
                      color="primary"
                      variant="outlined"
                    >
                      <PreviewIcon />
                    </IconButton>

                    <div className={styles.shareActionWrapper}>
                      <ShareQuizButton
                        quizId={quiz.id}
                        labelDisplay="never"
                        disabled={!quiz.isPublic}
                        className={styles.shareAction}
                        color="primary"
                        variant="outlined"
                      />
                    </div>
                  </div>
                </div>
              </Sheet>
            ))}
          </div>
        )
      }
    />
  )
}
