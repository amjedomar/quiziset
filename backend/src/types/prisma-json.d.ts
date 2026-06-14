/**
 * custom types for prisma "Json" fields (consumed by "prisma-json-types-generator")
 *
 * the "/// [QuizQuestions]" comment on the "questions" field in schema.prisma
 * links it to "PrismaJson.QuizQuestions" below
 *
 * we reuse the exact type from QuizEntity (to avoid code duplication)
 */
declare global {
  namespace PrismaJson {
    type QuizQuestions = import('@/modules/quiz/entities/quiz.entity').QuizEntity['questions']
  }
}

export {}
