import { Metadata } from 'next'
import SigninPage from '@/components/auth/LoginPage'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'ログイン | Silolab Blog',
  robots: 'noindex',
}

export default function Page() {
  return (
    <Suspense>
      <SigninPage />
    </Suspense>
  )
}
