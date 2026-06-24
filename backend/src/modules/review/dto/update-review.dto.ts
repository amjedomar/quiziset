import { PartialType } from '@nestjs/swagger'
import { CreateReviewDto } from '@/modules/review/dto/create-review.dto'

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
