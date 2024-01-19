'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, isValidID } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, useState } from 'react'

type Props = {
  defaultId?: string
}

export function NewArticleInput({ defaultId = '' }: Props) {
  const [draftId, setDraftId] = useState<string>(defaultId)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const submit = async () => {
    setLoading(true)
    router.push(`/admin/draft/${draftId}`)
  }

  const validId: boolean = isValidID(draftId)

  const onEnterKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || draftId.length < 4 || !validId) {
      return
    }

    await submit()
  }

  return (
    <div>
      <div className="flex flex-row mt-2">
        <Input
          className="w-full"
          placeholder="記事ID (4文字以上)"
          disabled={loading}
          value={draftId}
          onChange={(e) => setDraftId(e.target.value)}
          onKeyDown={onEnterKeyDown}
        />
        <Button
          variant="default"
          className={cn('ml-2', { 'w-20': !loading, 'w-28': loading })}
          disabled={loading || draftId.length < 4 || !validId}
          onClick={submit}
        >
          {loading && <Loader2 size={20} className="mr-2 animate-spin" />}
          作成
        </Button>
      </div>
      {draftId.length > 0 && !validId && (
        <p className="mt-2 ml-2 text-red-500 text-sm">
          記事IDは半角英数字とハイフンのみ使用できます
        </p>
      )}
    </div>
  )
}
