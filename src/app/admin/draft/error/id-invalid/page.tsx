import { Button } from '@/components/ui/button'
import { FolderLock } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '無効な記事ID | Silolab Blog',
}

export default function Page() {
  return (
    <div className="w-full max-w-[500px] p-6 rounded-3xl mx-auto my-28 bg-card">
      <h2 className="mb-4 flex justify-center text-3xl">
        エラー: この記事IDは利用できません
      </h2>
      <p className="flex justify-center text-card-foreground/60">
        記事IDには英数字とハイフンのみ使用できます
      </p>
      <div className="w-full mt-4 flex justify-center">
        <Button asChild variant="secondary">
          <a href="/admin/dashboard">
            <FolderLock className="text-2xl mr-2" />
            Dashboardに戻る
          </a>
        </Button>
      </div>
    </div>
  )
}
