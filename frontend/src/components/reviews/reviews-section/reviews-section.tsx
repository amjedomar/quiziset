'use client'

import { Fragment, useState } from 'react'
import { Box, Button, Divider, Sheet, Tooltip, Typography } from '@mui/joy'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { useDeleteReview, useGetQuizReviews } from '@/generated-api-client/review'
import { ErrorResponseView } from '@/components/error-response-view'
import { useRetainedQuery } from '@/hooks/use-retained-query'
import { Loading } from '@/components/loading'
import { StarsRating } from '@/components/reviews/stars-rating'
import { ReviewItem } from '@/components/reviews/review-item'
import { ReviewForm } from '@/components/reviews/review-form'
import styles from './reviews-section.module.scss'

interface ReviewsSectionProps {
  quizId: number
  /** whether the current user can leave a review (i.e. finished the quiz at least once) */
  canReview: boolean
}

export function ReviewsSection({ quizId, canReview }: ReviewsSectionProps) {
  const [isWriting, setIsWriting] = useState(false)

  const queryResult = useGetQuizReviews(quizId)
  const { data: reviews, error, isLoading } = useRetainedQuery(queryResult)
  const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteReview()

  if (isLoading) {
    return <Loading />
  }

  if (!reviews) {
    return <ErrorResponseView error={error} />
  }

  const myReview = reviews.find((review) => review.isMine)
  const otherReviews = reviews.filter((review) => !review.isMine)

  const reviewsCount = reviews.length
  const averageRating = reviewsCount === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount

  const handleDelete = async () => {
    if (!myReview) return
    await deleteReview({ quizId, reviewId: myReview.id })
  }

  const renderMyReview = () => {
    // editing an existing review OR creating a new one
    if (isWriting) {
      return (
        <Sheet variant="soft" className={styles.myReviewBox}>
          <ReviewForm
            quizId={quizId}
            existingReview={myReview}
            onDone={() => setIsWriting(false)}
            onCancel={() => setIsWriting(false)}
          />
        </Sheet>
      )
    }

    // the user already has a review
    if (myReview) {
      return (
        <Sheet variant="soft" className={styles.myReviewBox}>
          <ReviewItem
            review={myReview}
            onEdit={() => setIsWriting(true)}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            myReview
          />
        </Sheet>
      )
    }

    // no review yet --> show the "write a review" button
    const writeButton = (
      <Button startDecorator={<RateReviewIcon />} disabled={!canReview} onClick={() => setIsWriting(true)}>
        Write a review
      </Button>
    )

    if (canReview) {
      return writeButton
    }

    return (
      <Tooltip title="Finish the quiz at least once to leave a review">
        {/* since the button is disabled we should wrap it with span so the tooltip works */}
        <span>{writeButton}</span>
      </Tooltip>
    )
  }

  return (
    <Box>
      <Typography level="title-lg" sx={{ mb: 1.5 }}>
        Reviews
      </Typography>

      <div className={styles.summary}>
        {reviewsCount === 0 ? (
          <Typography level="body-md" textColor="text.tertiary">
            No reviews yet (be the first to review this quiz)
          </Typography>
        ) : (
          <>
            <span className={styles.summaryScore}>{averageRating.toFixed(1)}</span>
            <StarsRating value={averageRating} readOnly size="md" />
            <Typography level="body-sm" textColor="text.tertiary">
              {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}
            </Typography>
          </>
        )}
      </div>

      <Box sx={{ mt: 2.5, mb: 1 }}>{renderMyReview()}</Box>

      {otherReviews.map((review, index) => (
        <Fragment key={review.id}>
          {index > 0 && <Divider />}
          <ReviewItem review={review} />
        </Fragment>
      ))}
    </Box>
  )
}
