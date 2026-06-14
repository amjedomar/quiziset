import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayMinSize,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum QuestionType {
  Checkbox = 'question-checkbox',
  Radio = 'question-radio',
  Reorder = 'question-reorder',
  Cards = 'question-cards',
}

/**
 * This class is custom validation logic for:
 *  - answer[].isCorrect
 *  - answer[].imageUrl
 *
 * that depends on question-type
 */
@ValidatorConstraint({ name: 'answersMatchQuestionType' })
class AnswersMatchQuestionTypeConstraint implements ValidatorConstraintInterface {
  private getErrors(questionType: QuestionType, answers: AnswerDto[]): string[] {
    const errors: string[] = []

    const pushError = (newError: string) => {
      errors.push(`${newError} (since question type is '${questionType}')`)
    }

    answers.forEach((answer, answerIndex) => {
      const answerPath = `answers.${answerIndex}`

      // imageUrl is required for "question-cards"
      if (questionType === QuestionType.Cards && !answer.imageUrl) {
        pushError(`${answerPath}.imageUrl must be provided`)
      }

      // isCorrect is required for every questionType (except "question-reorder")
      if (questionType !== QuestionType.Reorder && typeof answer.isCorrect !== 'boolean') {
        pushError(`${answerPath}.isCorrect boolean value must be provided`)
      }
    })

    return errors
  }

  validate(answers: AnswerDto[], args: ValidationArguments): boolean {
    const { questionType } = args.object as QuestionDto
    if (!Object.values(QuestionType).includes(questionType)) return true
    return this.getErrors(questionType, answers).length === 0
  }

  defaultMessage(args: ValidationArguments): string {
    const { questionType, answers } = args.object as QuestionDto
    const errors = this.getErrors(questionType, answers)
    return errors.join(' & ')
  }
}

/**
 * omit answer fields that don't belong to current questionType:
 *  - imageUrl is kept only for "question-cards"
 *  - isCorrect is kept for every questionType (except "question-reorder")
 */
function normalizeAnswers(questionType: QuestionType, answers: AnswerDto[]): AnswerDto[] {
  if (!Array.isArray(answers)) {
    // if answers isn't array (then validation will be handled by "@IsArray")
    return answers
  }

  for (const answer of answers) {
    if (questionType !== QuestionType.Cards) delete answer.imageUrl
    if (questionType === QuestionType.Reorder) delete answer.isCorrect
  }

  return answers
}

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  text: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'should be provided for all question (except question-reorder)',
  })
  isCorrect?: boolean

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'for "question-cards" it must be provided. otherwise, it will be ignored',
  })
  imageUrl?: string
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string

  @IsEnum(QuestionType)
  @ApiProperty({ enum: QuestionType, example: QuestionType.Cards })
  questionType: QuestionType

  @Validate(AnswersMatchQuestionTypeConstraint)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Transform(({ obj, value }: { obj: QuestionDto; value: AnswerDto[] }) => normalizeAnswers(obj.questionType, value))
  // @Type is required for the validation of objects inside array
  @Type(() => AnswerDto) // see https://stackoverflow.com/a/58366367/8148505
  @ApiProperty({
    type: [AnswerDto],
    example: [
      { text: 'Answer 1', isCorrect: true, imageUrl: '/uploads/quizzes/answer1.png' },
      { text: 'Answer 2', isCorrect: true, imageUrl: '/uploads/quizzes/answer2.png' },
    ],
  })
  answers: AnswerDto[]
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '/uploads/quizzes/cover-image.png' })
  imageUrl: string

  @IsBoolean()
  @ApiProperty()
  isPublic: boolean

  @IsBoolean()
  @ApiProperty()
  isAnalyticsEnabled: boolean

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @ApiProperty({ type: [QuestionDto] })
  questions: QuestionDto[]
}
