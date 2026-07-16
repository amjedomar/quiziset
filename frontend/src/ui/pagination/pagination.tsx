import { IconButton } from '@mui/joy'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import styles from './pagination.module.scss'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = Array.from({ length: totalPages }, (_unused, index) => index + 1)

  return (
    <nav className={styles.pagination}>
      <IconButton
        data-testid="pagination-prev"
        variant="outlined"
        color="neutral"
        className={styles.button}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon />
      </IconButton>

      {pageNumbers.map((pageNumber) => (
        <IconButton
          key={pageNumber}
          data-testid={`pagination-page-${pageNumber}`}
          variant={pageNumber === page ? 'solid' : 'outlined'}
          color={pageNumber === page ? 'primary' : 'neutral'}
          className={styles.button}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </IconButton>
      ))}

      <IconButton
        data-testid="pagination-next"
        variant="outlined"
        color="neutral"
        className={styles.button}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon />
      </IconButton>
    </nav>
  )
}
