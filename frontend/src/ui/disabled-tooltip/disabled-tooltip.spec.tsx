import { render } from '@testing-library/react'
import { Button } from '@mui/joy'
import { DisabledTooltip } from './disabled-tooltip'

describe('DisabledTooltip', () => {
  it('correctly renders (enabled state)', () => {
    const { asFragment } = render(
      <DisabledTooltip disabled={false} title="Not available">
        <Button data-testid="child">Action</Button>
      </DisabledTooltip>,
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('correctly renders (disabled state)', () => {
    const { asFragment } = render(
      <DisabledTooltip disabled title="Not available">
        <Button data-testid="child">Action</Button>
      </DisabledTooltip>,
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
