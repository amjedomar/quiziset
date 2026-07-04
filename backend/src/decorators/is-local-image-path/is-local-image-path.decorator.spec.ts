import { validate } from 'class-validator'
import { IsLocalImagePath } from './is-local-image-path.decorator'

class TestDto {
  @IsLocalImagePath()
  imageUrl: string
}

describe('IsLocalImagePath', () => {
  it('passes for a path starting with /uploads', async () => {
    const dto = new TestDto()
    dto.imageUrl = '/uploads/quizzes/cover.png'

    expect(await validate(dto)).toHaveLength(0)
  })

  it('passes for a path starting with /public', async () => {
    const dto = new TestDto()
    dto.imageUrl = '/public/images/quizzes/js-basics.jpg'

    expect(await validate(dto)).toHaveLength(0)
  })

  it('fails for an absolute external url', async () => {
    const dto = new TestDto()
    dto.imageUrl = 'https://example.com/image.png'

    expect(await validate(dto)).toHaveLength(1)
  })
})
