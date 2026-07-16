import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog } from '@mui/joy'
import AnalyticsIcon from '@mui/icons-material/Analytics'

interface AnalyticsConsentModalProps {
  isAccepting: boolean
  onAccept: () => void
  onQuit: () => void
}

export function AnalyticsConsentModal({ isAccepting, onAccept, onQuit }: AnalyticsConsentModalProps) {
  return (
    <Modal open>
      <ModalDialog sx={{ width: 'calc(100% - 32px)', maxWidth: 500 }}>
        <DialogTitle>
          <AnalyticsIcon />
          Share analytics?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <p style={{ margin: '0 0 12px' }}>
            This quiz will share the following data <b>with the quiz creator</b>:
          </p>
          <ul style={{ margin: 0 }}>
            <li>Your name & avatar on Quiziset</li>
            <li>Your score of this quiz</li>
            <li>The start time & duration you took to finish this quiz</li>
          </ul>
          <p style={{ margin: '12px 0 0' }}>You need to accept sharing analytics in order to start this quiz</p>
        </DialogContent>
        <DialogActions>
          <Button data-testid="accept-analytics-button" loading={isAccepting} onClick={onAccept}>
            Accept
          </Button>
          <Button
            data-testid="quit-quiz-button"
            variant="plain"
            color="neutral"
            disabled={isAccepting}
            onClick={onQuit}
          >
            Quit
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  )
}
