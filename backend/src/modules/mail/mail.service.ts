import { Injectable } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'

@Injectable()
export class MailService {
  private readonly transporter: Transporter
  private readonly from: string | undefined

  constructor() {
    /**
     * in development the SMTP settings point to the "mailcatcher" docker container
     * (see ".env.sample") so no real emails are sent
     *
     * in production (if this app were to be deployed in production though I built it for a
     * university assignment only) but anyway in case of prod environment these env variables
     * should be changed to a real SMTP provider
     */
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // mailcatcher don't use TLS
      // only pass credentials when they are configured (mailcatcher doesn't need them)
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    })

    this.from = process.env.MAIL_FROM
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const subject = 'Reset your Quiziset password'
    const description = 'Click the link below to reset your password on Quiziset (it expires in 3 hours)'

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: subject,
      text: `${description}\n${resetUrl}`,
      html: `
        <p>${description}</p>
        <p><a href="${resetUrl}">Reset my password</a></p>
      `,
    })
  }
}
