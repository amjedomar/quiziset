import { HTMLAttributes } from 'react'
import { NEXT_PUBLIC_API_BASE_URL } from '@/constants/api-url'

interface BackendBackgroundImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * image relative path that is returned from backend
   */
  src: string | null | undefined
}

/**
 * this component is similar to <BackendImage />
 * (i.e. it prepends `NEXT_PUBLIC_API_BASE_URL` to the image relative url)
 *
 * but instead of rendering <img> it renders <div /> (with backgroundImage style) instead
 */
export function BackendBackgroundImage({ src, style, ...props }: BackendBackgroundImageProps) {
  return (
    <div {...props} style={{ ...style, backgroundImage: src ? `url(${NEXT_PUBLIC_API_BASE_URL}${src})` : undefined }} />
  )
}
