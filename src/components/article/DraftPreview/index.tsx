'use client'

import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState, useTransition } from 'react'
import { TabContext } from '../DraftWorkspace'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'

function fallbackRender({ error, resetErrorBoundary }: any) {
  return (
    <div className="w-full">
      <div className="w-fit mx-auto">
        <p>
          Failed to load preview. Digest:{' '}
          <span className="text-red-400">{error.digest}</span>
        </p>
      </div>
      <div className="w-fit mx-auto mt-4">
        <Button
          variant={'secondary'}
          onClick={resetErrorBoundary}
          className="text-base"
        >
          Reload
        </Button>
      </div>
    </div>
  )
}

type Props = {
  children: React.ReactNode
}

export default function DraftPreview({ children }: Props) {
  const router = useRouter()
  const [_, startTransition] = useTransition()
  const { active, registerOnMount } = useContext(TabContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    registerOnMount('preview', async () => {
      if (loading) {
        return
      }
      setLoading(true)
      startTransition(() => {
        router.refresh()
        setLoading(false)
      })
    })
  })

  if (loading) {
    return <p>loading...</p>
  }

  if (active !== 'preview') {
    return null
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>
  )
}
