import { ChangeEvent, ReactNode, useRef } from 'react'
import { FormFieldCore } from '@/ui/form-fields/form-field-core'
import styles from './form-image.module.scss'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import clsx from 'clsx'
import { useUpload } from '@/api-client/uploads'
import { CircularProgress, IconButton } from '@mui/joy'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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
          onChange(`${API_BASE_URL}${result.data.url}`)
        }

        const handleDelete = () => {
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className={styles.image} />

              <IconButton
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
