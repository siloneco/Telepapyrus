import { Inter } from 'next/font/google'
import HeaderNav from '@/components/layout/HeaderNav'
import styles from '@/components/style/layout/Layout.module.css'
import resetStyle from '@/components/style/Reset.module.css'
import NextAuthProvider from '@/components/layout/NextAuth'
import clsx from 'clsx'

import '@/components/style/layout/global.css'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang='jp'>
      <body className={clsx(inter.className, resetStyle.reset, styles.body)}>
        <HeaderNav />
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
        <div style={{ padding: '0px 1rem' }}>
          <hr color='#636363' className={styles.bar} />
        </div>
        <div className={styles.footer}>
          <p className={styles.footerText}>Contribute to this blog software at <a href='https://github.com/siloneco/Telepapyrus' target='_blank' rel='noopener noreferrer' className={styles.footerText}>siloneco/Telepapyrus</a></p>
        </div>
      </body>
    </html>
  )
}
