import { render } from '@testing-library/react'
import { Sortable } from './sortable'

jest.mock('@dnd-kit/react/sortable', () => ({
  useSortable: jest.fn().mockReturnValue({}),
}))

describe('Sortable', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Sortable id="1" index={0} className="test-class">
        item content
      </Sortable>,
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
