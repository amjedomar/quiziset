import { render } from '@testing-library/react'
import { makePublicUser } from '@/test-utils/mocks'
import { SessionUserCell } from './session-user-cell'

describe('SessionUserCell', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<SessionUserCell user={makePublicUser()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it("shows the user's name", () => {
    const { getByText } = render(<SessionUserCell user={makePublicUser({ name: 'Amjed Omar' })} />)

    expect(getByText('Amjed Omar')).toBeInTheDocument()
  })
})
