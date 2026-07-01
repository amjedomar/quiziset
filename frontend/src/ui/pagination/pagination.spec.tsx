import { fireEvent, render } from '@testing-library/react'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Pagination page={1} totalPages={3} onPageChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={jest.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a button for each page', () => {
    const { getByText } = render(<Pagination page={1} totalPages={3} onPageChange={jest.fn()} />)

    expect(getByText('1')).toBeInTheDocument()
    expect(getByText('2')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
  })

  it('calls onPageChange with the clicked page number', () => {
    const onPageChange = jest.fn()
    const { getByText } = render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />)

    fireEvent.click(getByText('2'))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables the previous button on the first page', () => {
    const { getByTestId } = render(<Pagination page={1} totalPages={3} onPageChange={jest.fn()} />)

    expect(getByTestId('pagination-prev')).toBeDisabled()
    expect(getByTestId('pagination-next')).not.toBeDisabled()
  })

  it('disables the next button on the last page', () => {
    const { getByTestId } = render(<Pagination page={3} totalPages={3} onPageChange={jest.fn()} />)

    expect(getByTestId('pagination-prev')).not.toBeDisabled()
    expect(getByTestId('pagination-next')).toBeDisabled()
  })
})
