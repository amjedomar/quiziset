import { MailService } from './mail.service'

const sendMail = jest.fn()
const createTransport = jest.fn().mockReturnValue({ sendMail })
jest.mock('nodemailer', () => ({
  createTransport: (...args: unknown[]) => createTransport(...args),
}))

describe('MailService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.MAIL_FROM = 'Quiziset <no-reply@quiziset.local>'
  })

  it('sends a password reset email containing the reset link', async () => {
    const service = new MailService()

    const resetUrl = 'http://localhost:3003/reset-password?token=abc'
    await service.sendPasswordResetEmail('amjed@example.com', resetUrl)

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'amjed@example.com',
        from: 'Quiziset <no-reply@quiziset.local>',
        subject: expect.stringContaining('Reset'),
        text: expect.stringContaining(resetUrl),
        html: expect.stringContaining(resetUrl),
      }),
    )
  })
})
