'use client'

import { Box, Button, CircularProgress, Stack, Typography } from '@mui/joy'
import { FormProvider, useForm } from 'react-hook-form'
import SaveIcon from '@mui/icons-material/Save'
import { FormInput } from '@/ui/form-fields/form-input'
import { useUpdateMe } from '@/generated-api-client/user'
import { useAuth } from '@/hooks/use-auth'
import { ProfileAvatarEditor } from '@/components/profile/profile-avatar-editor'
import { isErrorResponse } from '@/utils/is-error-response'
import { useSnackbar } from '@/components/snackbar'

interface ProfileFormData {
  name: string
  email: string
}

export function ProfileForm() {
  const { isCheckingLogin, currentUser, isLoadingCurrentUser } = useAuth()
  const { showError, showSuccess } = useSnackbar()
  const { mutateAsync: updateMe, isPending: isUpdating } = useUpdateMe()

  const form = useForm<ProfileFormData>({
    defaultValues: currentUser ? { name: currentUser.name, email: currentUser.email } : undefined,
  })

  const onSubmit = async (data: ProfileFormData) => {
    const result = await updateMe({ data })

    if (isErrorResponse(result.data)) {
      showError(result.data.message)
      return
    }

    showSuccess('Profile updated')
  }

  if (isCheckingLogin || isLoadingCurrentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentUser) {
    return (
      <Typography sx={{ mt: 6 }} textAlign="center">
        Could not load your profile
      </Typography>
    )
  }

  return (
    <Stack spacing={4} sx={{ mt: 4 }}>
      <Typography level="h3" textAlign="center">
        Your Profile
      </Typography>

      <ProfileAvatarEditor user={currentUser} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <FormInput name="name" label="Name" type="text" />

            <FormInput name="email" label="Email" type="email" />

            <Button data-testid="save-profile-button" type="submit" startDecorator={<SaveIcon />} loading={isUpdating}>
              Save
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Stack>
  )
}
