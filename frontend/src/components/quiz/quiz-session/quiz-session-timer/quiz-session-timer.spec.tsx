import { act, render } from '@testing-library/react'
import { QuizSessionTimer } from './quiz-session-timer'

describe('QuizSessionTimer', () => {
  const currentDateMock = new Date('2026-01-01T00:00:00.000Z')
  // expireDateMock is relative to currentDateMock (so in this case expire duration is "30 minutes")
  const expireDateMock = new Date('2026-01-01T00:00:30.000Z')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(currentDateMock)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<QuizSessionTimer expireTime="2026-01-01T00:01:30.000Z" onExpire={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('counts down correctly', () => {
    const onExpire = jest.fn()

    const { getByText } = render(<QuizSessionTimer expireTime={expireDateMock.toISOString()} onExpire={onExpire} />)

    expect(getByText('00:30')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(getByText('00:28')).toBeInTheDocument()
  })

  it('calls onExpire once time runs out', () => {
    const onExpire = jest.fn()

    const { getByText } = render(<QuizSessionTimer expireTime={expireDateMock.toISOString()} onExpire={onExpire} />)

    expect(getByText('00:30')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(30000)
    })

    expect(onExpire).toHaveBeenCalledTimes(1)
  })
})
