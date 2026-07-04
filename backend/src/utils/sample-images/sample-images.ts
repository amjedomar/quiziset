/**
 * Get the relative path of the sample "Quiz" image that is stored in "public" directory
 */
export function getQuizSampleImagePath(imageName: string): string {
  return `/public/images/quizzes/${imageName}.jpg`
}

/**
 * Get the relative path of the sample "Avatar" image that is stored in "public" directory
 */
export function getSampleAvatarPath(avatarName: string): string {
  return `/public/images/avatars/${avatarName}.jpg`
}
