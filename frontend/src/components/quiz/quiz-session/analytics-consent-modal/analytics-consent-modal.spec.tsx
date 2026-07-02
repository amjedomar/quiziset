import { fireEvent, render } from '@testing-library/react'
import { AnalyticsConsentModal } from './analytics-consent-modal'

describe('AnalyticsConsentModal', () => {
  it('correctly renders', () => {
    // use `baseElement` instead of container/asFragment (because we need to capture
    // the content of the <Portal> attached to document.body)
    const { baseElement } = render(
      <AnalyticsConsentModal isAccepting={false} onAccept={jest.fn()} onQuit={jest.fn()} />,
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('calls onAccept/onQuit when the respective button is clicked', () => {
    const onAccept = jest.fn()
    const onQuit = jest.fn()

    const { getByTestId } = render(<AnalyticsConsentModal isAccepting={false} onAccept={onAccept} onQuit={onQuit} />)

    fireEvent.click(getByTestId('accept-analytics-button'))
    fireEvent.click(getByTestId('quit-quiz-button'))

    expect(onAccept).toHaveBeenCalled()
    expect(onQuit).toHaveBeenCalled()
  })
})
