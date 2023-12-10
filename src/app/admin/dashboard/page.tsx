'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isValidID } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, useState } from 'react'

export default function Page() {
  const [draftId, setDraftId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const submit = async () => {
    setLoading(true)
    router.push(`/admin/draft/${draftId}`)
  }

  const onEnterKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || draftId.length < 4) {
      return
    }

    await submit()
  }

  return (
    <div className="max-w-5xl mx-auto mt-5 mb-10">
      <h1 className="text-4xl font-bold text-center">Dashboard (WIP)</h1>
      <div className="w-fit mx-auto mt-6">
        <h2 className="w-fit text-xl font-bold">記事を作成する</h2>
        <div className="flex flex-row mt-2">
          <Input
            className="w-72"
            placeholder="記事ID (4文字以上)"
            disabled={loading}
            value={draftId}
            onChange={(e) => setDraftId(e.target.value)}
            onKeyDown={onEnterKeyDown}
          />
          <Button
            variant="default"
            className="ml-2"
            disabled={loading || draftId.length < 4 || !isValidID(draftId)}
            onClick={submit}
          >
            {loading && <Loader2 size={20} className="mr-2 animate-spin" />}
            {!loading && <>作成</>}
            {loading && <>作成中...</>}
          </Button>
        </div>
        {draftId.length > 0 && !isValidID(draftId) && (
          <p className="mt-2 ml-2 text-red-500 text-sm">
            記事IDは半角英数字とハイフンのみ使用できます
          </p>
        )}
      </div>
    </div>
  )
}
