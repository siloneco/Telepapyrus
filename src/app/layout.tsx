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
      <body style={{ backgroundColor: '#191C24' }} className={`${inter.className} ${resetStyle.reset}`}>
        <HeaderNav />
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
        <div style={{ padding: '0px 1rem' }}>
          <hr color='#636363' style={{ maxWidth: '50rem', marginBottom: '0px', color: '#636363' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', height: '75px', padding: '0px 1rem' }}>
          <p style={{ color: "#C1C1C1" }}>Contribute to this blog software in <a href="https://github.com/siloneco/Telepapyrus" style={{ color: '#C1C1C1' }}>siloneco/Telepapyrus</a></p>
        </div>
      </body>
    </html>
  )
}
