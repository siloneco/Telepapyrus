import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaChevronRight } from 'react-icons/fa'

type Props = {
  path: string
  page: number
}

export default function PageForward({ path, page }: Props) {
  const url = page === 1 ? `${path}` : `${path}?page=${page}`

  return (
    <Button asChild variant="secondary" className="mr-5">
      <Link key={page} href={url}>
        <div className="flex flex-row items-center">
          次のページ <FaChevronRight className="ml-2" />
        </div>
      </Link>
    </Button>
  )
}
