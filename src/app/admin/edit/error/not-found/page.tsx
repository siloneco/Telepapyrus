import { Button } from '@/components/ui/button'
import { FolderLock } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '記事が見つかりません | Silolab Blog',
}

export default function Page() {
  return (
    <div className="w-full max-w-[450px] p-6 rounded-3xl mx-auto my-28 bg-card">
      <h2 className="mb-4 flex justify-center text-3xl">
        エラー: 記事が見つかりませんでした
      </h2>
      <p className="flex justify-center text-card-foreground/60">
        記事IDが間違っている可能性があります。
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
