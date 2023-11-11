import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaChevronLeft } from 'react-icons/fa'
import { cn } from '@/lib/utils'

type Props = {
  path: string
  page: number
  bright: boolean
}

export default function PageBack({ path, page, bright }: Props) {
  return (
    <Button
      asChild
      variant="secondary"
      className={cn('mr-5', bright && 'border border-gray-400')}
    >
      <Link key={page} href={`${path}${page}`}>
        {bright && (
          <div className="flex flex-row items-center">
            <FaChevronLeft className="mr-2" />
            前のページ
          </div>
        )}
        {!bright && (
          <div className="flex flex-row items-center">
            <FaChevronLeft className="mr-2" /> 前のページ
          </div>
        )}
      </Link>
    </Button>
  )
}
