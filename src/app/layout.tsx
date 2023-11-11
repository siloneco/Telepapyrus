import { Inter as FontSans } from 'next/font/google'
import HeaderNav from '@/components/layout/HeaderNav'
import NextAuthProvider from '@/components/layout/NextAuth'
import '@/components/style/layout/global.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import Footer from '@/components/layout/Footer'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="jp">
      <body className={cn(fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderNav />
          <NextAuthProvider>
            <div>{children}</div>
          </NextAuthProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
