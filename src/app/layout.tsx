import { Inter } from 'next/font/google'
import HeaderNav from '@/components/layout/HeaderNav'
import styles from '@/components/style/Layout.module.css'
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
      <body className={`${inter.className} ${resetStyle.reset} ${styles.body}`}>
        <HeaderNav />
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
        <div style={{ padding: '0px 1rem' }}>
          <hr color='#636363' className={styles.bar} />
        </div>
        <div className={styles.footer}>
          <p className={styles.footerText}>Contribute to this blog software in <a href="https://github.com/siloneco/Telepapyrus" className={styles.footerText}>siloneco/Telepapyrus</a></p>
        </div>
      </body>
    </html>
  )
}
