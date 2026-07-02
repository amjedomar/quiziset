import { render } from '@testing-library/react'
import { SessionStatusChip } from './session-status-chip'

describe('SessionStatusChip', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<SessionStatusChip isFinished={false} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows "Finished" or "Ongoing" depending on isFinished', () => {
    const { getByText, rerender } = render(<SessionStatusChip isFinished={false} />)

    expect(getByText('Ongoing')).toBeInTheDocument()

    rerender(<SessionStatusChip isFinished />)

    expect(getByText('Finished')).toBeInTheDocument()
  })
})
