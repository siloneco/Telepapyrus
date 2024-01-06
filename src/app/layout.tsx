import { Inter as FontSans } from 'next/font/google'
import HeaderNav from '@/components/layout/HeaderNav'
import NextAuthProvider from '@/components/layout/NextAuth'
import './global.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ja-JP">
      <body className={cn(fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <HeaderNav />
          <NextAuthProvider>
            <div>{children}</div>
          </NextAuthProvider>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
