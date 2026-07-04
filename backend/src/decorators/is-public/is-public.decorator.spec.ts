import { IS_PUBLIC_METADATA, IsPublic } from './is-public.decorator'

describe('IsPublic', () => {
  it('sets the "IS_PUBLIC" metadata to true on the decorated handler', () => {
    class TestController {
      @IsPublic()
      handler() {}
    }

    expect(Reflect.getMetadata(IS_PUBLIC_METADATA, TestController.prototype.handler)).toBe(true)
  })
})
