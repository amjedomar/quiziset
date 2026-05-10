import { ReactNode } from 'react'
import styles from '@/components/container/container.module.scss'

interface ContainerProps {
  children: ReactNode
}

export default function Container({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>
}
