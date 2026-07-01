import { fireEvent, render } from '@testing-library/react'
import { SnackbarProvider, useSnackbar } from './snackbar-provider'

function Trigger() {
  const { showSuccess } = useSnackbar()

  return <button onClick={() => showSuccess('Saved!')}>trigger</button>
}

describe('SnackbarProvider', () => {
  it('correctly renders', () => {
    const { asFragment } = render(
      <SnackbarProvider>
        <Trigger />
      </SnackbarProvider>,
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows the snackbar message when useSnackbar is triggered', () => {
    const { getByText } = render(
      <SnackbarProvider>
        <Trigger />
      </SnackbarProvider>,
    )

    fireEvent.click(getByText('trigger'))

    expect(getByText('Saved!')).toBeInTheDocument()
  })
})
