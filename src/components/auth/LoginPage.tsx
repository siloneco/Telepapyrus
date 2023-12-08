'use client'

import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function SigninPage() {
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const callbackUrl: string | null = searchParams.get('callbackUrl')

  const onClick = async () => {
    setLoading(true)

    const urlAfterSignin = callbackUrl ? callbackUrl : '/admin/dashboard'
    await signIn('github', { callbackUrl: urlAfterSignin })
  }

  return (
    <div className="max-w-3xl my-40 mx-3 flex justify-center md:mx-auto">
      <Button
        variant={'secondary'}
        className="h-20 rounded-xl px-12"
        onClick={onClick}
        disabled={loading}
      >
        {loading && <Loader2 className="animate-spin" size={36} />}
        {!loading && <FaGithub className="text-4xl" />}
        <p className="text-xl ml-4">GitHubでログイン</p>
      </Button>
    </div>
  )
}
