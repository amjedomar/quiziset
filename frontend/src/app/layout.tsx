import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '@/app/globals.scss'
import { AppProvider } from '@/app/app-provider'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer'

const inter = Geist({
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Quiziset', // "default" is used when a page does not set its own title
    template: 'Quiziset | %s', // "template" wraps every page title (e.g. "Login" becomes "Quiziset | Login")
  },
  description: 'Create, Share & Explore different sets of Quizzes',
  applicationName: 'Quiziset',
  openGraph: {
    siteName: 'Quiziset',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
        <Footer />
      </body>
    </html>
  )
}
