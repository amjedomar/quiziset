import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog } from '@mui/joy'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'

interface ConfirmDeleteModalProps {
  open: boolean
  isDeleting?: boolean
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDeleteModal({
  open,
  isDeleting = false,
  title = 'Confirm deletion',
  message,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog variant="outlined" role="alertdialog" maxWidth="sm">
        <DialogTitle>
          <WarningRoundedIcon />
          {title}
        </DialogTitle>
        <Divider />
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button data-testid="confirm-delete-button" color="danger" loading={isDeleting} onClick={onConfirm}>
            Delete
          </Button>
          <Button
            data-testid="cancel-delete-button"
            variant="plain"
            color="neutral"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  )
}
