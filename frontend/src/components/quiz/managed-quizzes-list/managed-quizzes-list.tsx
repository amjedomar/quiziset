'use client'
import { Button, CircularProgress, Input, Sheet, Typography } from '@mui/joy'
import Link from 'next/link'
import { BackendImage } from '@/ui/backend-image'
import { FavoriteButton } from '@/components/quiz/favorite-button'
import { QuizzesList } from '@/components/quiz/quizzes-list'
import styles from './managed-quizzes-list.module.scss'
import SearchIcon from '@mui/icons-material/Search'
import UpdateIcon from '@mui/icons-material/Edit'
import AnalyticsIcon from '@mui/icons-material/Insights'
import CreateIcon from '@mui/icons-material/Add'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import GroupsIcon from '@mui/icons-material/Groups'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'

export function ManagedQuizzesList() {
  return (
    <QuizzesList
      params={{ managedByMe: true }}
      renderHeader={({ SortComponent, totalMatches, onSearch }) => (
        <div className={styles.headerSection}>
          <div className={styles.header}>
            <Typography level="h2">Manage Quizzes</Typography>

            <Button component={Link} href={`/manage-quizzes/create`} variant="solid" startDecorator={<CreateIcon />}>
              Create Quiz
            </Button>
          </div>

          <div className={styles.searchRow}>
            <Input
              className={styles.searchInput}
              variant="outlined"
              startDecorator={<SearchIcon />}
              placeholder="Search your quizzes"
              onChange={(event) => onSearch(event.target.value)}
            />

            <SortComponent />
          </div>

          <Typography level="body-sm" textColor="text.tertiary">
            {totalMatches} total {totalMatches === 1 ? 'match' : 'matches'}
          </Typography>
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

                  <div className={styles.actions}>
                    <Button
                      component={Link}
                      href={`/manage-quizzes/${quiz.id}/update`}
                      variant="soft"
                      startDecorator={<UpdateIcon />}
                    >
                      Update
                    </Button>

                    <Button variant="outlined" disabled={!quiz.isAnalyticsEnabled} startDecorator={<AnalyticsIcon />}>
                      Analytics
                    </Button>

                    <FavoriteButton quizId={quiz.id} isFavorite={!!quiz.isFavorite} />
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
