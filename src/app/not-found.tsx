import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="w-full mt-20 mb-20">
      <div className="flex flex-col items-center">
        <h1 className="text-6xl">404</h1>
        <h2 className="text-2xl">ページが見つかりません</h2>
        <Button asChild className="mt-8">
          <Link href="/">ホームに戻る</Link>
        </Button>
      </div>
    </div>
  )
}
