'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [draftId, setDraftId] = useState<string>('')
  const router = useRouter()

  return (
    <div className="max-w-5xl mx-auto mt-5 mb-10">
      <h1 className="text-4xl font-bold text-center">Dashboard (WIP)</h1>
      <div className="w-fit mx-auto mt-6">
        <h2 className="w-fit text-xl font-bold">記事を作成する</h2>
        <div className="flex flex-row mt-2">
          <Input
            className="w-72"
            placeholder="記事ID (4文字以上)"
            value={draftId}
            onChange={(e) => setDraftId(e.target.value)}
          />
          <Button
            variant="default"
            className="ml-2"
            disabled={draftId.length < 4}
            onClick={() => router.push(`/admin/draft/${draftId}`)}
          >
            作成
          </Button>
        </div>
      </div>
    </div>
  )
}
