import { IsArray, IsInt, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SubmitQuizSessionAnswerDto {
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @ApiProperty({
    type: [Number],
    example: [0, 2],
    description:
      'indexes of the chosen answers for the current question. ' +
      'For "question-reorder" it is the answers arranged in the chosen order (order matters). ' +
      'For the other question types it is the set of selected answers (order is ignored)',
  })
  answerIndexes: number[]

  @IsInt()
  @Min(0)
  @ApiProperty({
    example: 0,
    description:
      'the question index this answer is for. ' +
      'if it does not match the current question index (e.g. quiz is open in another tab ' +
      'that already moved on) the answer is ignored and the current state is returned',
  })
  questionIndex: number
}
