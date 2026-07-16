import { fireEvent, render } from '@testing-library/react'
import { ShareQuizButton } from './share-quiz-button'

jest.mock('react-copy-to-clipboard', () => ({
  CopyToClipboard: ({
    children,
    text,
    onCopy,
  }: {
    children: React.ReactNode
    text: string
    onCopy: (copiedText: string, result: boolean) => void
  }) => (
    <div data-testid="copy-to-clipboard" data-text={text} onClick={() => onCopy(text, true)}>
      {children}
    </div>
  ),
}))

const showSuccess = jest.fn()
jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showSuccess }),
}))

describe('ShareQuizButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<ShareQuizButton quizId={7} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('copies the absolute overview link and shows a success snackbar', () => {
    const { getByTestId } = render(<ShareQuizButton quizId={7} />)

    expect(getByTestId('copy-to-clipboard')).toHaveAttribute('data-text', 'http://localhost/quizzes/7/overview')

    fireEvent.click(getByTestId('share-quiz-7-button'))

    expect(showSuccess).toHaveBeenCalledWith('Quiz link copied to clipboard!')
  })
})
