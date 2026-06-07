import { FormControlField } from '@/ui/form-fields/form-control-field'
import styles from './form-image.module.scss'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import clsx from 'clsx'

interface FormImageProps {
  name: string
  label: string
}

export function FormImage({ name, label }: FormImageProps) {
  return (
    <FormControlField
      name={name}
      label={label}
      defaultValue=""
      renderField={({ fieldState: { invalid } }) => (
        <div className={clsx(styles.formImage, { [styles.formImageError]: invalid })}>
          <AddOutlinedIcon className={styles.icon} />
        </div>
      )}
    />
  )
}
