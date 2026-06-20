/**
 * custom types for schema.prisma "Json" fields
 * (handled by "prisma-json-types-generator" npm package)
 */
declare global {
  namespace PrismaJson {
    /**
     * the "/// [QuizQuestions]" comment in schema.prisma
     * (on the "questions" field of the "Quiz" model)
     * references this type
     */
    type QuizQuestions = import('@/modules/quiz/entities/quiz.entity').QuizEntity['questions']

    /**
     * the "/// [QuizSessionQuestions]" comment in schema.prisma
     * (on the "questions" field of the "QuizSession" model)
     * references this type
     */
    type QuizSessionQuestions = import('@/modules/quiz/entities/quiz-session.entity').QuizSessionStoredQuestion[]
  }
}

export {}
