export const QuizErrors = {
  NOT_FOUND: 'quiz not found',
  FORBIDDEN: 'you are not the manager of this quiz',
  VIEW_FORBIDDEN: 'this quiz is private',
}

export const QuizAnalyticsErrors = {
  ANALYTICS_DISABLED: 'please enable analytics sharing on update quiz page',
}

export const QuizSessionErrors = {
  ANALYTICS_SHARE_REQUIRED: 'sharing analytics is required to start a session for this quiz',
  /**
   * error "NO_ACTIVE_SESSION"
   * - is thrown for "submitAnswer" only
   * - however for "startSession" (it creates a new session if there isn't)
   *   it doesn't throw this error
   */
  NO_ACTIVE_SESSION: 'no active quiz session found',
}
