import { Metadata } from 'next'
import SigninPage from '@/components/auth/LoginPage'

export const metadata: Metadata = {
  title: 'ログイン | Silolab Blog',
}

export default function Page() {
  return <SigninPage />
}
