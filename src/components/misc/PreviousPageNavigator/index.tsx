'use client'

import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  className?: string
  children?: React.ReactNode
}

export default function PreviousPageNavigator({ className }: Props) {
  const router = useRouter()

  return (
    <div className="w-fit">
      <p
        onClick={() => router.back()}
        className={cn(
          'mb-2 flex flex-row items-center text-foreground/60 font-bold dark:font-normal cursor-pointer',
          className,
        )}
      >
        <ArrowLeft size={26} className="text-foreground/60" />
        戻る
      </p>
    </div>
  )
}
