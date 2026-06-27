'use client'

import { MouseEvent, useEffect, useState } from 'react'
import { IconButton } from '@mui/joy'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useAddFavorite, useRemoveFavorite } from '@/api-client/quiz'
import { isErrorResponse } from '@/utils/is-error-response'
import { useSnackbar } from '@/components/snackbar'

interface FavoriteButtonProps {
  quizId: number
  isFavorite: boolean // the current favorite state coming from the server
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({ quizId, isFavorite: isFavoriteProp, size }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp)

  const { mutateAsync: addFavorite, isPending: isAdding } = useAddFavorite()
  const { mutateAsync: removeFavorite, isPending: isRemoving } = useRemoveFavorite()
  const { showError } = useSnackbar()

  const isPending = isAdding || isRemoving

  useEffect(() => {
    setIsFavorite(isFavoriteProp) // keep in sync when the server value changes
  }, [isFavoriteProp])

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    // this button might be inside a clickable card (a Link) --> so prevent navigation
    e.preventDefault()
    e.stopPropagation()

    if (isPending) return

    try {
      const response = isFavorite ? await removeFavorite({ quizId }) : await addFavorite({ quizId })

      if (isErrorResponse(response.data)) {
        showError(response.data.message)
        return
      }

      setIsFavorite(!isFavorite)
    } catch {
      showError(`Failed to ${isFavorite ? 'unfavorite' : 'favorite'} the quiz (please check your internet connection)`)
    }
  }

  return (
    <IconButton
      variant="outlined"
      color={isFavorite ? 'danger' : 'neutral'}
      size={size}
      loading={isPending}
      onClick={handleClick}
    >
      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  )
}
