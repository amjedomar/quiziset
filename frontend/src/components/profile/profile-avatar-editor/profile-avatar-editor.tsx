'use client'

import { ChangeEvent, useRef } from 'react'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/joy'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import DeleteIcon from '@mui/icons-material/Delete'
import { useUpload } from '@/generated-api-client/uploads'
import { useUpdateMe } from '@/generated-api-client/user'
import { UserAvatar } from '@/components/user-avatar'
import { isErrorResponse } from '@/utils/is-error-response'
import { useSnackbar } from '@/components/snackbar'
import { UserEntity } from '@/generated-api-client/model'
import styles from './profile-avatar-editor.module.scss'

interface ProfileAvatarEditorProps {
  user: UserEntity
}

export function ProfileAvatarEditor({ user }: ProfileAvatarEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showError, showSuccess } = useSnackbar()
  const { mutateAsync: uploadFile, isPending: isUploading } = useUpload()
  const { mutateAsync: updateMe, isPending: isUpdating } = useUpdateMe()

  const isLoading = isUploading || isUpdating

  const updateImage = async (imageUrl: string | null) => {
    const result = await updateMe({ data: { imageUrl } })

    if (isErrorResponse(result.data)) {
      showError(result.data.message)
      return
    }

    showSuccess(imageUrl ? 'Profile image updated' : 'Profile image removed')
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    if (!file) return

    const result = await uploadFile({ bucketName: 'profiles', data: { file } })

    if (isErrorResponse(result.data)) {
      showError(result.data.message)
      return
    }

    await updateImage(result.data.url)
  }

  const handleRemove = () => updateImage(null)

  return (
    <Box className={styles.editor}>
      <UserAvatar name={user.name} imageUrl={user.imageUrl} className={styles.avatar} />

      {isLoading && (
        <Box className={styles.loadingOverlay}>
          <CircularProgress size="sm" />
        </Box>
      )}

      <Tooltip title={user.imageUrl ? 'Change image' : 'Upload image'}>
        <IconButton
          component="label"
          size="sm"
          variant="solid"
          color="primary"
          disabled={isLoading}
          className={styles.uploadButton}
        >
          <PhotoCameraIcon style={{ fontSize: 16 }} />
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg, .jpeg, .png"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </IconButton>
      </Tooltip>

      {user.imageUrl && (
        <Tooltip title="Remove image">
          <IconButton
            data-testid="remove-image-button"
            size="sm"
            variant="soft"
            color="danger"
            disabled={isLoading}
            onClick={handleRemove}
            className={styles.deleteButton}
          >
            <DeleteIcon style={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
