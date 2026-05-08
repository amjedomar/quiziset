import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '@/app/globals.css'
import { AppProvider } from '@/app/app-provider'
import Navbar from '@/components/navbar/navbar'

const inter = Geist({
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Quiziset',
  description: 'Create, Share & Explore different sets of Quizzes',
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
      </body>
    </html>
  )
}
