'use client'

import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Stack, Textarea, Typography } from '@mui/joy'
import { useCreateReview, useUpdateReview } from '@/generated-api-client/review'
import { ReviewEntity } from '@/generated-api-client/model'
import { isErrorResponse } from '@/utils/is-error-response'
import { StarsRating } from '@/components/reviews/stars-rating'
import { useSnackbar } from '@/components/snackbar'

interface ReviewFormProps {
  quizId: number
  existingReview?: ReviewEntity // when provided the form edits an existing review (otherwise it creates a new one)
  onDone: () => void
  onCancel: () => void
}

export function ReviewForm({ quizId, existingReview, onDone, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const { showError } = useSnackbar()

  const { mutateAsync: createReview, isPending: isCreating } = useCreateReview()
  const { mutateAsync: updateReview, isPending: isUpdating } = useUpdateReview()

  const isPending = isCreating || isUpdating
  const isEditing = Boolean(existingReview)

  const handleSubmit = async () => {
    const data = { rating, comment: comment.trim() }

    const response = existingReview
      ? await updateReview({ quizId, reviewId: existingReview.id, data })
      : await createReview({ quizId, data })

    if (isErrorResponse(response.data)) {
      showError(response.data.message)
      return
    }

    onDone()
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography level="title-md" sx={{ mb: 2 }}>
        {isEditing ? 'Edit your review' : 'Write a review'}
      </Typography>

      <Stack sx={{ gap: 2 }}>
        <FormControl>
          <FormLabel>Rating</FormLabel>
          <StarsRating value={rating} onChange={setRating} size="lg" />
        </FormControl>

        <FormControl>
          <FormLabel>Comment (optional)</FormLabel>
          <Textarea
            minRows={3}
            placeholder="Write your review about this quiz..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            slotProps={{ textarea: { maxLength: 255, 'data-testid': 'review-comment-textarea' } }}
          />
        </FormControl>

        <Stack direction="row" sx={{ gap: 1 }}>
          <Button data-testid="submit-review-button" onClick={handleSubmit} loading={isPending} disabled={rating === 0}>
            {isEditing ? 'Update review' : 'Submit review'}
          </Button>
          <Button variant="plain" color="neutral" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
