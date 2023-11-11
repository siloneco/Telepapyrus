import Link from 'next/link'
import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Props = {
  tag: string
}

export default function ArticleTag({ tag }: Props) {
  return (
    <Link
      key={tag}
      href={`/tag/${tag}`}
      className={cn(
        badgeVariants({ variant: 'skyblue' }),
        'mr-2',
        'mb-2',
        'text-xs',
      )}
    >
      {tag}
    </Link>
  )
}
