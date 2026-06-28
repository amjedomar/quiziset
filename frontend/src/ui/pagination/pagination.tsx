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
        variant="outlined"
        color="neutral"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon />
      </IconButton>

      {pageNumbers.map((pageNumber) => (
        <IconButton
          key={pageNumber}
          variant={pageNumber === page ? 'solid' : 'outlined'}
          color={pageNumber === page ? 'primary' : 'neutral'}
          size="sm"
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </IconButton>
      ))}

      <IconButton
        variant="outlined"
        color="neutral"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon />
      </IconButton>
    </nav>
  )
}
