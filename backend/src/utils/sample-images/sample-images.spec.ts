import { getQuizSampleImagePath, getSampleAvatarPath } from './sample-images'

describe('getQuizSampleImagePath', () => {
  it('returns the relative path of the quiz sample image', () => {
    expect(getQuizSampleImagePath('js-basics')).toBe('/public/images/quizzes/js-basics.jpg')
  })
})

describe('getSampleAvatarPath', () => {
  it('returns the relative path of the sample avatar image', () => {
    expect(getSampleAvatarPath('avatar-1')).toBe('/public/images/avatars/avatar-1.jpg')
  })
})
