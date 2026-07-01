import { Switch, SwitchProps, Typography } from '@mui/joy'
import { Controller, useFormContext } from 'react-hook-form'
import styles from './form-switch.module.scss'

interface FormSwitchProps extends Omit<SwitchProps, 'checked' | 'onChange'> {
  name: string
  label?: string
}

export function FormSwitch({ name, label, slotProps, ...radioProps }: FormSwitchProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { value, ...fieldProps } }) => {
        const switchField = (
          <Switch
            {...radioProps}
            {...fieldProps}
            checked={!!value}
            slotProps={{ ...slotProps, input: { ...slotProps?.input, 'data-testid': `switch-${name}` } }}
          />
        )

        return label ? (
          <Typography className={styles.label} component="label" startDecorator={switchField}>
            {label}
          </Typography>
        ) : (
          switchField
        )
      }}
    />
  )
}
