'use client'

import { MouseEvent, useEffect, useState } from 'react'
import { IconButton } from '@mui/joy'
import { useRouter } from 'next/navigation'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useAddFavorite, useRemoveFavorite } from '@/generated-api-client/quiz'
import { isErrorResponse } from '@/utils/is-error-response'
import { useSnackbar } from '@/components/snackbar'
import { useAuth } from '@/hooks/use-auth'
import { appendRedirectParam, LoginReason } from '@/utils/redirect'

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
  const { isLoggedIn, isCheckingLogin } = useAuth()
  const router = useRouter()

  const isPending = isAdding || isRemoving

  useEffect(() => {
    setIsFavorite(isFavoriteProp) // keep in sync when the server value changes
  }, [isFavoriteProp])

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    // this button might be inside a clickable card (a Link) --> so prevent navigation
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      if (isCheckingLogin) return

      const currentPageUrl = window.location.pathname
      router.push(appendRedirectParam('/login', currentPageUrl, LoginReason.Favorite))
      return
    }

    if (isPending) return

    const response = isFavorite ? await removeFavorite({ quizId }) : await addFavorite({ quizId })

    if (isErrorResponse(response.data)) {
      showError(`Failed to ${isFavorite ? 'unfavorite' : 'favorite'} the quiz (please check your internet connection)`)
      return
    }

    setIsFavorite(!isFavorite)
  }

  return (
    <IconButton
      data-testid="favorite-button"
      variant="outlined"
      color={isFavorite ? 'danger' : 'neutral'}
      size={size}
      disabled={isPending}
      onClick={handleClick}
    >
      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  )
}
