'use client'

import { NewArticleInput } from '@/components/admin/NewArticleInput'
import { Button } from '@/components/ui/button'
import { FileEdit } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function ArticleIdConflictError() {
  const searchParams = useSearchParams()

  const id: string | undefined = searchParams.get('id') ?? undefined

  return (
    <div className="w-full max-w-[600px] p-6 rounded-3xl mx-auto my-28 bg-card">
      <h2 className="mb-4 flex justify-center text-3xl">
        エラー: この記事IDは既に利用されています
      </h2>
      <div className="w-full mt-8 flex justify-center">
        <Button asChild variant="default">
          <a href="/admin/dashboard">
            <FileEdit className="text-2xl mr-2" />
            記事を編集する
          </a>
        </Button>
      </div>
      <p className="flex justify-center m-4 text-card-foreground/60">または</p>
      <div className="w-2/3 mx-auto mt-4">
        <h2 className="w-fit text-lg text-card-foreground font-bold">
          別のIDで続行する
        </h2>
        <NewArticleInput defaultId={id} />
      </div>
    </div>
  )
}
