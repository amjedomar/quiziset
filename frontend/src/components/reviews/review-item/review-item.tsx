'use client'

import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/joy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ReviewEntity } from '@/api-client/model'
import { StarsRating } from '@/components/reviews/stars-rating'
import { UserAvatar } from '@/components/user-avatar'
import styles from './review-item.module.scss'
import { formatDate } from '@/utils/dates'

interface ReviewItemProps {
  review: ReviewEntity

  // the following props works only if `review.isMine` is true
  onEdit?: () => void
  onDelete?: () => void
  isDeleting?: boolean
}

export function ReviewItem({ review, onEdit, onDelete, isDeleting }: ReviewItemProps) {
  const { author, rating, comment, isMine, updatedAt } = review

  return (
    <Box className={styles.item}>
      <div className={styles.header}>
        <div>
          <div className={styles.authorRow}>
            <UserAvatar name={author.name} imageUrl={author.imageUrl} size="sm" />
            <Typography level="title-sm">{author.name}</Typography>
            {isMine && (
              <Chip size="sm" variant="soft" color="primary">
                You
              </Chip>
            )}
          </div>

          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarsRating value={rating} readOnly size="sm" />
            <Typography level="body-xs" textColor="text.tertiary">
              {formatDate(updatedAt)}
            </Typography>
          </Box>
        </div>

        {isMine && (
          <div className={styles.actions}>
            <Tooltip title="Edit">
              <IconButton size="sm" variant="plain" color="neutral" onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="sm" variant="plain" color="danger" loading={isDeleting} onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>

      {comment && (
        <Typography level="body-md" textColor="text.secondary" className={styles.comment}>
          {comment}
        </Typography>
      )}
    </Box>
  )
}
