import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaChevronRight } from 'react-icons/fa'

type Props = {
  path: string
  page: number
}

export default function PageForward({ path, page }: Props) {
  return (
    <Button asChild variant="secondary" className="mr-5 border border-gray-400">
      <Link key={page} href={`${path}${page}`}>
        <div className="flex flex-row items-center">
          次のページ <FaChevronRight className="ml-2" />
        </div>
      </Link>
    </Button>
  )
}
