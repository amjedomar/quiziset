import { FormFieldCore } from '@/ui/form-fields/form-field-core'
import styles from './form-image.module.scss'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import clsx from 'clsx'

interface FormImageProps {
  name: string
  label?: string
  boxSize?: 'sm' | 'md'
}

export function FormImage({ name, label, boxSize = 'md' }: FormImageProps) {
  return (
    <FormFieldCore
      name={name}
      label={label}
      defaultValue=""
      renderField={({ fieldState: { invalid } }) => (
        <div className={clsx(styles.formImage, styles[boxSize], { [styles.formImageError]: invalid })}>
          <AddOutlinedIcon className={styles.icon} />
        </div>
      )}
    />
  )
}
