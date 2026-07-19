import { render } from '@testing-library/react'
import { LoadingBox } from './loading-box'

describe('LoadingBox', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<LoadingBox />)

    expect(asFragment()).toMatchSnapshot()
  })
})
