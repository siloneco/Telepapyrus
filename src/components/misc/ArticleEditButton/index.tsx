import { Button } from '@/components/ui/button'

import { FileEdit } from 'lucide-react'
import Link from 'next/link'

type Props = {
  id: string
  className?: string
}

export default function ArticleEditButton({ id, className }: Props) {
  return (
    <Button variant="ghost" className={className} aria-label="edit-article">
      <Link href={`/admin/edit/${id}`}>
        <FileEdit className="text-foreground" />
      </Link>
    </Button>
  )
}
