import { ChangeEvent, ReactNode, useRef } from 'react'
import { FormFieldCore } from '@/ui/form-fields/form-field-core'
import styles from './form-image.module.scss'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import clsx from 'clsx'
import { useDeleteFile, useUpload } from '@/generated-api-client/uploads'
import { CircularProgress, IconButton } from '@mui/joy'
import { isErrorResponse } from '@/utils/is-error-response'
import { BackendImage } from '@/ui/backend-image'

interface FormImageProps {
  name: string
  label?: string
  boxSize?: 'sm' | 'md'
  /**
   * - This "bucketName" prop used for Upload only
   * - However, when this field has value (then it requests the image url as it is)
   */
  bucketName: 'quizzes' | 'profiles'
}

const BOX_SIZE_CLASSES: Record<NonNullable<FormImageProps['boxSize']>, string> = {
  sm: styles.wrapperSm,
  md: styles.wrapperMd,
}

export function FormImage({ name, label, boxSize = 'md', bucketName }: FormImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: uploadFile, isPending: isUploading } = useUpload()
  const { mutateAsync: deleteFile } = useDeleteFile()

  /**
   * tracks the images uploaded during this form session so that if such an
   * image is then removed (or replaced) before saving we can delete its
   * file from the server immediately
   *
   * a pre-existing image (i.e. in the form's initial value) is NOT tracked here
   *  - removing it only clears the field
   *  - then the backend deletes the old file on update request (if user clicked save button)
   */
  const uploadedInThisSession = useRef<Set<string>>(new Set())

  const deleteUnsavedUpload = async (url: string) => {
    if (!url || !uploadedInThisSession.current.has(url)) {
      return
    }

    const fileName = url.split('/').pop()
    if (fileName) {
      await deleteFile({ bucketName, fileName })
    }

    uploadedInThisSession.current.delete(url)
  }

  return (
    <FormFieldCore
      name={name}
      label={label}
      defaultValue=""
      renderField={({ field: { ref, onChange, value: imageUrl }, fieldState: { invalid } }) => {
        const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0]
          if (!file) return
          const result = await uploadFile({ bucketName, data: { file } })

          if (!isErrorResponse(result.data)) {
            // if we are replacing an image uploaded earlier this session (delete its file)
            await deleteUnsavedUpload(imageUrl)

            uploadedInThisSession.current.add(result.data.url)

            /**
             * store the relative path only (without domain)
             * the domain is prepended at display time via <BackendImage>
             */
            onChange(result.data.url)
          }
        }

        const handleDelete = async () => {
          // delete the file from the server only if it was uploaded this session (i.e. not saved yet)
          await deleteUnsavedUpload(imageUrl)

          onChange('')
          if (fileInputRef.current) {
            // reset file upload input (so user can re-upload same file if wants to)
            fileInputRef.current.value = ''
          }
        }

        let content: ReactNode
        if (imageUrl) {
          content = (
            <>
              <BackendImage src={imageUrl} alt="" className={styles.image} />

              <IconButton
                data-testid={`${name}-delete-button`}
                color="danger"
                variant="soft"
                size="sm"
                className={styles.deleteButton}
                onClick={handleDelete}
              >
                <CloseOutlinedIcon style={{ fontSize: 14 }} />
              </IconButton>
            </>
          )
        } else if (isUploading) {
          content = <CircularProgress size="sm" />
        } else {
          /**
           * see https://stackoverflow.com/questions/572768/styling-an-input-type-file-button/25825731#25825731
           * to style input (of type="file") hide it with "display": "none"
           * then wrap it inside label
           */
          content = (
            <>
              <label className={styles.inputLabel}>
                <AddOutlinedIcon fontSize="inherit" />

                <input type="file" accept=".jpg, .jpeg, .png" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
            </>
          )
        }

        return (
          /**
           * A trick to make "div" focusable is to use "tabIndex={-1}"
           * see https://stackoverflow.com/questions/3656467/is-it-possible-to-focus-on-a-div-using-javascript-focus-function
           *
           * This way: in case user submits the form without uploading image (when it is required)
           * --> then react-hook-form will be able to focus it (and scroll to it)
           */
          <div
            tabIndex={-1}
            ref={ref}
            className={clsx(styles.wrapper, BOX_SIZE_CLASSES[boxSize], {
              [styles.wrapperInvalid]: invalid,
            })}
          >
            {content}
          </div>
        )
      }}
    />
  )
}
