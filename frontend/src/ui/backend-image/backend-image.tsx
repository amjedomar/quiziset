import { ImgHTMLAttributes } from 'react'
import { NEXT_PUBLIC_API_BASE_URL } from '@/constants/api-url'

interface BackendImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /**
   * image relative path that is returned from backend
   */
  src: string | null | undefined
}

/**
 * Renders an <img> for an image served by the backend
 *
 * It prepends `NEXT_PUBLIC_API_BASE_URL` to the image relative "src"
 */
export function BackendImage({ src, alt, ...props }: BackendImageProps) {
  return <img src={src ? `${NEXT_PUBLIC_API_BASE_URL}${src}` : ''} alt={alt} {...props} />
}
