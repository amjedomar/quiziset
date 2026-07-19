'use client'

import { Button, Stack, Typography } from '@mui/joy'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStartQuizSession, useSubmitQuizSessionAnswer } from '@/generated-api-client/quiz-session'
import { ErrorResponse, QuizSessionStateEntity, QuestionEntityQuestionType } from '@/generated-api-client/model'
import { LoadingBox } from '@/components/loading-box'
import { ErrorResponseView } from '@/components/error-response-view'
import { AnalyticsConsentModal } from '@/components/quiz/quiz-session/analytics-consent-modal'
import { QuizSessionProgress } from '@/components/quiz/quiz-session/quiz-session-progress'
import { QuizSessionTimer } from '@/components/quiz/quiz-session/quiz-session-timer'
import { QuizQuestion } from '@/components/quiz/quiz-session/quiz-question'
import { QuizResult } from '@/components/quiz/quiz-session/quiz-result'
import { useSnackbar } from '@/components/snackbar'
import { getQuestionHint } from '@/components/quiz/question-type-select'
import styles from './quiz-session.module.scss'

interface QuizSessionProps {
  quizId: number
}

/**
 * the "default" answer for a newly shown question:
 * - "question-reorder" --> default value is the answers in their initial displayed order
 * - the other types --> DOESN'T have a default value
 */
function getDefaultAnswer(question: QuizSessionStateEntity['currentQuestion']): number[] {
  if (question?.questionType === QuestionEntityQuestionType['question-reorder']) {
    return question.answers.map((_, index) => index)
  }

  return []
}

export function QuizSession({ quizId }: QuizSessionProps) {
  const hasStartedRef = useRef(false)

  const { showError: showSnackbarError } = useSnackbar()

  const [isStarting, setIsStarting] = useState(false)
  const [sessionState, setSessionState] = useState<QuizSessionStateEntity | null>(null)
  const [error, setError] = useState<ErrorResponse>()
  const [needsAnalyticsConsent, setNeedsAnalyticsConsent] = useState(false)
  const [answerIndexes, setAnswerIndexes] = useState<number[]>([])

  const router = useRouter()

  const { mutateAsync: startSession } = useStartQuizSession()
  const { mutateAsync: submitAnswer, isPending: isSubmitting } = useSubmitQuizSessionAnswer()

  const updateSessionData = useCallback((data: QuizSessionStateEntity) => {
    setSessionState(data)
    setAnswerIndexes(getDefaultAnswer(data.currentQuestion))
  }, [])

  /**
   * starts (or resumes) the quiz session
   * "isAnalyticsShared" is sent only after the user accepts the analytics consent
   */
  const start = useCallback(
    async (isAnalyticsShared?: boolean) => {
      setIsStarting(true)

      const { status, data } = await startSession({ quizId, data: { isAnalyticsShared } })

      if (status === 200) {
        setNeedsAnalyticsConsent(false)
        setError(undefined)
        updateSessionData(data)
      } else if (status === 400) {
        // the quiz has analytics enabled -> ask the user to share analytics first
        setNeedsAnalyticsConsent(true)
      } else {
        if (needsAnalyticsConsent) {
          showSnackbarError(data.message)
        } else {
          setError(data)
        }
      }

      setIsStarting(false)
    },
    [needsAnalyticsConsent, quizId, showSnackbarError, startSession, updateSessionData],
  )

  useEffect(() => {
    if (!hasStartedRef.current) {
      start()
      hasStartedRef.current = true
    }
  }, [start])

  const handleSubmit = useCallback(
    async (indexes: number[]) => {
      if (!sessionState) return

      const { status, data } = await submitAnswer({
        quizId,
        data: { questionIndex: sessionState.currentQuestionIndex, answerIndexes: indexes },
      })

      if (status === 200) {
        updateSessionData(data)
      } else {
        showSnackbarError(data.message)
      }
    },
    [quizId, submitAnswer, updateSessionData, sessionState, showSnackbarError],
  )

  const handleExpire = useCallback(() => {
    // when the time is up the answer no longer matters
    // (the backend ends the session without evaluating the answer)
    handleSubmit([])
  }, [handleSubmit])

  if (error) {
    return <ErrorResponseView error={error} />
  }

  if (needsAnalyticsConsent) {
    return (
      <AnalyticsConsentModal
        isAccepting={isStarting}
        onAccept={() => start(true)}
        onQuit={() => router.push(`/quizzes/${quizId}/overview`)}
      />
    )
  }

  // still starting (return loading)
  if (!sessionState) {
    return <LoadingBox />
  }

  if (sessionState.isFinished) {
    return <QuizResult state={sessionState} quizId={quizId} />
  }

  const { currentQuestion, currentQuestionIndex, questionsCount, expireTime, quizTitle } = sessionState
  const isLastQuestion = currentQuestionIndex === questionsCount - 1
  const canSubmit = answerIndexes.length > 0

  // "currentQuestion" is always present while the session is ongoing
  // (this check is just to avoid TypeScript errors while accessing `currentQuestion` below)
  if (!currentQuestion) {
    return <LoadingBox />
  }

  return (
    <Stack sx={{ py: 2, gap: 3 }}>
      <Typography level="h3" className={styles.quizTitle}>
        Quiz: {quizTitle}
      </Typography>

      <QuizSessionProgress currentQuestionIndex={currentQuestionIndex} questionsCount={questionsCount} />

      {expireTime && <QuizSessionTimer expireTime={expireTime} onExpire={handleExpire} />}

      <div>
        <Typography level="h4" data-testid="quiz-question-title">
          {currentQuestion.title}
        </Typography>

        <Typography level="body-sm" textColor="text.tertiary" sx={{ mt: 0.5 }}>
          {getQuestionHint(currentQuestion.questionType)}
        </Typography>
      </div>

      <QuizQuestion question={currentQuestion} value={answerIndexes} onChange={setAnswerIndexes} />

      <Button
        size="lg"
        loading={isSubmitting}
        disabled={!canSubmit}
        onClick={() => handleSubmit(answerIndexes)}
        sx={{ alignSelf: 'flex-end' }}
      >
        {isLastQuestion ? 'Finish' : 'Next Question'}
      </Button>
    </Stack>
  )
}
