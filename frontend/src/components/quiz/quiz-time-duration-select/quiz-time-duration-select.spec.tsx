import { fireEvent, screen } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { QuizTimeDurationSelect } from './quiz-time-duration-select'

describe('QuizTimeDurationSelect', () => {
  it('correctly renders', () => {
    const { asFragment } = renderWithFormContext(<QuizTimeDurationSelect name="timeDurationInMinutes" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when a duration is selected', () => {
    const { getByTestId, formMethods } = renderWithFormContext(<QuizTimeDurationSelect name="timeDurationInMinutes" />)

    fireEvent.mouseDown(getByTestId('select-timeDurationInMinutes'))
    fireEvent.click(screen.getByText('00:05'))

    expect(formMethods.getValues('timeDurationInMinutes')).toBe(5)
  })
})
