import { shuffle } from './shuffle'

describe('shuffle', () => {
  it('returns a new array with the same elements', () => {
    const original = [1, 2, 3, 4, 5]

    const result = shuffle(original)

    expect(result).toHaveLength(original.length)
    expect(result).toEqual(expect.arrayContaining(original))
  })

  it('does not mutate the input array', () => {
    const original = [1, 2, 3, 4, 5]

    shuffle(original)

    expect(original).toEqual([1, 2, 3, 4, 5])
  })
})
