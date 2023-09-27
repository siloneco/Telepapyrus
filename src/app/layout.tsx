import { Inter } from 'next/font/google'
import HeaderNav from '@/components/layout/HeaderNav'
import resetStyle from '@/components/style/Reset.module.css'
import NextAuthProvider from '@/components/layout/NextAuth'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='jp'>
      <body style={{ backgroundColor: '#f5f5f5' }} className={`${inter.className} ${resetStyle.reset}`}>
        <HeaderNav />
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
        <div style={{ padding: '0px 1rem' }}>
          <hr style={{ maxWidth: '50rem', marginBottom: '0px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', height: '75px', padding: '0px 1rem' }}>
          <p style={{ color: "gray" }}>Contribute to this blog software in <a href="https://github.com/siloneco/Telepapyrus" style={{ color: 'gray' }}>siloneco/Telepapyrus</a></p>
        </div>
      </body>
    </html>
  )
}
