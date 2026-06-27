import { applyDecorators } from '@nestjs/common'
import { Matches } from 'class-validator'

/**
 * validates that the value is a local image path (without domain) that starts
 * with "/uploads" or "/public"
 *
 * The image paths are stored without the domain in the database
 *
 * Then the frontend prepends the backend domain when displaying the image
 *
 * Why we do it like so? for two reasons:
 *  - we ensure that image url from other websites can't be stored in database
 *  - also this way if quiziset backend domain (or the "port" in case of local setup)
 *   is changed --> images will continue to work since we only store the image relative path
 */
export function IsLocalImagePath(): PropertyDecorator {
  const LOCAL_IMAGE_PATH_REGEX = /^\/(uploads|public)\/.+/

  return applyDecorators(
    Matches(LOCAL_IMAGE_PATH_REGEX, {
      message: '$property must be a local image path starting with /uploads or /public',
    }),
  )
}
