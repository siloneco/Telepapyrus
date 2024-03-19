import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaChevronLeft } from 'react-icons/fa'

type Props = {
  path: string
  page: number
}

export default function PageBack({ path, page }: Props) {
  const url = page === 1 ? `${path}` : `${path}?page=${page}`

  return (
    <Button asChild variant="secondary" className="mr-5">
      <Link key={page} href={url}>
        <div className="flex flex-row items-center">
          <FaChevronLeft className="mr-2" /> 前のページ
        </div>
      </Link>
    </Button>
  )
}
