import { render } from '@testing-library/react'
import { Loading } from './loading'

describe('Loading', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<Loading />)

    expect(asFragment()).toMatchSnapshot()
  })
})
