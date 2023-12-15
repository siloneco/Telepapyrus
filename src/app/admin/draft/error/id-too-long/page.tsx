import { Button } from '@/components/ui/button'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'
import { FolderLock } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '無効な記事ID | Telepapyrus',
}

export default function Page() {
  return (
    <div className="w-[768px] mx-auto my-28">
      <h2 className="mb-4 flex justify-center text-3xl">
        エラー: 記事IDが長すぎます
      </h2>
      <p className="flex justify-center text-gray-400">
        記事IDは{ARTICLE_ID_MAX_LENGTH}文字以下である必要があります
      </p>
      <div className="w-full mt-4 flex justify-center">
        <Button asChild variant="secondary">
          <a href="/admin/dashboard">
            <FolderLock className="text-2xl text-white mr-2" />
            Dashboardに戻る
          </a>
        </Button>
      </div>
    </div>
  )
}
