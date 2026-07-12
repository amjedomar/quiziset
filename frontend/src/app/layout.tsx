import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '@/app/globals.scss'
import { AppProvider } from '@/app/app-provider'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer'
import { USER_TOKEN_COOKIE } from '@/constants/auth'

/**
 * To avoid displaying auth buttons INITIALLY on navbar when user is LOGGED-IN
 *
 * we use this script workaround
 *
 * side-note: DON'T access cookies() from "next/headers" package in this layout.tsx
 * because doing so will opt-out static generation for ALL PAGES!
 * and FORCE them to be SSR
 *
 * this is why we use this JS trick instead :)
 */
const authNavbarScript = `
  (function () {
    try {
      var cookies = '; ' + document.cookie
      var isLoggedIn = cookies.indexOf('; ${USER_TOKEN_COOKIE}=') > -1
      document.documentElement.setAttribute('data-auth-logged-in', String(isLoggedIn))
    } catch (e) {}
  })()
`

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
    <html lang="en" className={`${inter.className}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: authNavbarScript }} />
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
        <Footer />
      </body>
    </html>
  )
}
