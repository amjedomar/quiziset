import { omitUndefinedAttrs } from './omit-undefined-attrs'

describe('omitUndefinedAttrs', () => {
  it('removes attributes whose value is undefined', () => {
    expect(omitUndefinedAttrs({ title: 'Quiz', description: undefined, isPublic: false })).toEqual({
      title: 'Quiz',
      isPublic: false,
    })
  })

  it('keeps attributes with a null value', () => {
    expect(omitUndefinedAttrs({ imageUrl: null, title: undefined })).toEqual({ imageUrl: null })
  })
})
